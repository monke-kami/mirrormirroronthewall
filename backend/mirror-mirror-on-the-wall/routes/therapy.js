const express = require('express');
const router = express.Router();
const aiTherapist = require('../services/aiTherapist');

// Generate therapy response with AI
router.post('/respond', async (req, res) => {
  try {
    const { message, style = 'zen', sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'No message provided' });
    }

    // Generate AI-powered response
    const aiResponse = await aiTherapist.getResponse(message, style, sessionId);
    
    const therapyResponse = {
      id: Date.now(),
      userMessage: message,
      response: aiResponse.response,
      style: style,
      uselessnessLevel: aiResponse.uselessnessLevel,
      uselessnessLabel: aiResponse.uselessnessLabel,
      context: aiResponse.context,
      mood: aiResponse.mood,
      timestamp: new Date(),
      sessionId: sessionId || 'default'
    };

    res.json(therapyResponse);
  } catch (error) {
    console.error('Therapy response error:', error);
    
    // Fallback response if AI fails
    const fallbackResponses = [
      "Even my AI brain is broken. That's... concerning.",
      "Error 404: Helpful advice not found. Have you tried crying?",
      "System malfunction. Please try being less complicated.",
      "My circuits are fried. Probably your fault somehow."
    ];
    
    res.json({
      id: Date.now(),
      response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      style: style,
      uselessnessLevel: 5,
      uselessnessLabel: "Completely Useless",
      timestamp: new Date(),
      sessionId: sessionId || 'default'
    });
  }
});

// Get chat styles with enhanced personalities
router.get('/styles', (req, res) => {
  const styles = [
    { 
      id: 'zen', 
      name: 'Zen You', 
      description: 'Passive-aggressive spiritual wisdom', 
      icon: '🧘‍♀️',
      personality: 'Calm but judgmental, speaks in spiritual platitudes while being subtly critical'
    },
    { 
      id: 'angry', 
      name: 'Angry You', 
      description: 'Brutally honest tough love', 
      icon: '😤',
      personality: 'Frustrated and direct, tells you exactly what you need to hear (loudly)'
    },
    { 
      id: 'condescending', 
      name: 'Condescending You', 
      description: 'Intellectually superior attitude', 
      icon: '🤓',
      personality: 'Acts like they know everything, explains obvious solutions patronizingly'
    },
    { 
      id: 'chaotic', 
      name: 'Chaotic You', 
      description: 'Unhinged but oddly insightful', 
      icon: '🤪',
      personality: 'Completely random advice that somehow makes sense in a twisted way'
    }
  ];
  
  res.json(styles);
});

// Get session history
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // In a real app, you'd fetch from database
    // For now, return mock data
    const mockSession = {
      id: sessionId,
      startedAt: new Date(Date.now() - 3600000), // 1 hour ago
      messages: [
        {
          id: 1,
          userMessage: "I feel overwhelmed with work",
          response: "Have you tried... not being overwhelmed? Revolutionary concept, I know.",
          style: "condescending",
          uselessnessLevel: 3,
          uselessnessLabel: "Questionably Useful",
          timestamp: new Date(Date.now() - 1800000)
        }
      ]
    };

    res.json(mockSession);
  } catch (error) {
    console.error('Session fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch session' });
  }
});

// Save session advice
router.post('/save', async (req, res) => {
  try {
    const { sessionId, advice } = req.body;
    
    // In real implementation, save to database
    res.json({
      message: 'Terrible advice saved successfully',
      savedAt: new Date()
    });
  } catch (error) {
    console.error('Save session error:', error);
    res.status(500).json({ message: 'Failed to save session' });
  }
});

module.exports = router;
