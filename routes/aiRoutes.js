import express from 'express';

const router = express.Router();

// Helper to build structured day-wise plan
function buildItinerary(promptText = '', pickupCity = 'Coimbatore (Base)') {
  const text = String(promptText).toLowerCase();

  let destination = 'Munnar & Valparai Misty Circuit';
  let tripType = 'South India Custom Escape';
  let vehicle = 'Toyota Innova / Ertiga (SUV)';
  let mode = 'Available With Luxury Rooms OR Cab + Sightseeing Only';

  if (text.includes('honeymoon') || text.includes('couple') || text.includes('2 people') || text.includes('romantic')) {
    tripType = 'Romantic Honeymoon Escape';
    destination = text.includes('kodai') ? 'Kodaikanal Misty Retreat' : 'Munnar & Top Station Retreat';
    vehicle = 'Swift Dzire / Etios (Sedan)';
    mode = 'Handpicked Luxury Rooms + Private AC Cab';
  } else if (text.includes('15') || text.includes('12') || text.includes('tempo') || text.includes('college') || text.includes('office')) {
    tripType = 'Group Tempo Traveller Tour';
    destination = text.includes('coorg') || text.includes('wayanad') ? 'Wayanad & Coorg Highland Circuit' : 'Ooty, Coonoor & Pykara Circuit';
    vehicle = text.includes('15') || text.includes('17') ? '17-Seater Tempo Traveller' : '14-Seater Tempo Traveller';
    mode = 'Cab + Sightseeing Only or Group Stay Package';
  } else if (text.includes('family') || text.includes('kids') || text.includes('elders') || text.includes('குடும்ப')) {
    tripType = 'Comfortable Family Vacation';
    destination = text.includes('alleppey') || text.includes('kerala') ? 'Munnar & Alleppey Backwaters' : 'Ooty & Coonoor Family Circuit';
    vehicle = 'Toyota Innova / Ertiga (SUV)';
    mode = 'Family-Friendly Rooms + Sightseeing Cab';
  } else if (text.includes('friends') || text.includes('gang') || text.includes('cab only')) {
    tripType = 'Friends & Weekend Adventure';
    destination = text.includes('munnar') ? 'Munnar & Athirappilly Circuit' : 'Valparai & Pollachi Chill Circuit';
    vehicle = 'Toyota Innova / Ertiga (SUV)';
    mode = 'Cab + Sightseeing Only (Best Value)';
  }

  let daysCount = 2;
  const dayMatch = text.match(/(\d+)\s*(day|days|நாள்|ദിവസ)/i);
  if (dayMatch) {
    daysCount = Math.min(Math.max(parseInt(dayMatch[1], 10), 1), 5);
  }

  const days = [];
  for (let i = 1; i <= daysCount; i++) {
    if (i === 1) {
      days.push({
        day: 'Day 1',
        heading: `${pickupCity} Pickup → ${destination} Arrival`,
        details: 'Morning doorstep pickup, scenic highway/ghat drive, key viewpoints & check-in/refreshment.',
      });
    } else if (i === daysCount) {
      days.push({
        day: `Day ${i}`,
        heading: `Local Sightseeing & Return to ${pickupCity}`,
        details: 'Morning viewpoints, local shopping/tea or spice stops & comfortable evening/night drop.',
      });
    } else {
      days.push({
        day: `Day ${i}`,
        heading: `Full-Day ${destination} Exploration`,
        details: 'Lakes, waterfalls, viewpoints & leisure time at your own pace.',
      });
    }
  }

  return {
    tripType,
    destination,
    vehicle,
    mode,
    summaryPlan: days.map((d) => `${d.day}: ${d.heading}`).join(' | '),
    days,
  };
}

// POST /api/ai/plan-trip (Used by AiTripPlanner.jsx)
router.post('/plan-trip', (req, res) => {
  try {
    const { prompt, pickupCity } = req.body || {};
    if (!prompt || !String(prompt).trim()) {
      return res.status(400).json({ success: false, message: 'Please enter a trip prompt.' });
    }

    const result = buildItinerary(prompt, pickupCity);
    return res.json({
      success: true,
      data: {
        tripType: result.tripType,
        destination: result.destination,
        vehicle: result.vehicle,
        plan: result.summaryPlan,
        mode: result.mode,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/ai/chat (Used by OdysseyAiChat.jsx)
router.post('/chat', (req, res) => {
  try {
    const { messages = [], pickupCity } = req.body || {};
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    const userText = lastUserMsg?.content || 'South India trip plan';

    const result = buildItinerary(userText, pickupCity);

    return res.json({
      success: true,
      structured: {
        badge: 'Dropido Odyssey AI Plan',
        title: `${result.destination} (${result.days.length} ${result.days.length > 1 ? 'Days' : 'Day'})`,
        greeting: `Here is a tailored ${result.tripType.toLowerCase()} starting from ${pickupCity || 'Coimbatore (Base)'}.`,
        days: result.days,
        fleet: result.vehicle,
        stayNote: result.mode,
        closingPrompt: 'Want exact per-head or cab tariff for your dates? Tap below!',
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;