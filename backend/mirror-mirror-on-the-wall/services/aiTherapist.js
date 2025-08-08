// AI Therapist Service - Free sarcastic response generator
class AITherapistService {
  constructor() {
    this.conversationHistory = new Map();
    this.userPatterns = new Map();
    this.responseTemplates = {
      zen: {
        starters: [
          "Have you considered that",
          "Perhaps the universe is telling you",
          "In my infinite wisdom, I sense that",
          "The chakras whisper to me that",
          "Ancient wisdom suggests"
        ],
        middles: [
          "your problems stem from your inability to",
          "you're overthinking this because",
          "the root cause is obviously",
          "you keep making the same mistake of",
          "your energy is blocked by"
        ],
        endings: [
          "Maybe try meditation... or not. 🧘‍♀️",
          "Namaste... away from your problems. ✨",
          "Inner peace requires outer effort, which you clearly lack. 🕉️",
          "The answer was inside you all along (unfortunately). 🌸",
          "Balance is key... unlike your life choices. ⚖️"
        ]
      },
      angry: {
        starters: [
          "ARE YOU KIDDING ME?!",
          "Seriously, AGAIN with this?!",
          "I can't believe I have to explain",
          "Oh for crying out loud!",
          "WHAT is wrong with you?!"
        ],
        middles: [
          "You KEEP doing the same stupid thing!",
          "How many times do I have to tell you",
          "It's like talking to a brick wall!",
          "You never listen to yourself!",
          "This is SO obvious it hurts!"
        ],
        endings: [
          "GET IT TOGETHER! 😤",
          "Do better! I'm literally you! 🔥",
          "Stop being such a disappointment! 💢",
          "Figure it out already! ⚡",
          "I'm done with this nonsense! 🤬"
        ]
      },
      condescending: {
        starters: [
          "Oh, how... quaint.",
          "Well, obviously",
          "Let me explain this slowly",
          "Since you clearly don't understand",
          "How adorable that you think"
        ],
        middles: [
          "that would solve anything. The real issue is",
          "but what you should be doing is",
          "when any reasonable person would",
          "instead of continuing to",
          "rather than this embarrassing display of"
        ],
        endings: [
          "You're welcome for this free education. 🤓",
          "Try to keep up next time. 📚",
          "I hope that wasn't too complicated for you. 🎓",
          "Maybe write this down so you don't forget. ✏️",
          "This should be obvious, but here we are. 🤷‍♀️"
        ]
      },
      chaotic: {
        starters: [
          "PLOT TWIST!",
          "What if... hear me out...",
          "Random thought:",
          "The voices in my head say",
          "I had a vision and"
        ],
        middles: [
          "you should become a professional llama trainer because",
          "the solution involves interpretive dance and",
          "have you considered that your problems are actually",
          "maybe the real issue is that you haven't tried",
          "what if we just ignore everything and"
        ],
        endings: [
          "Trust the process! 🤪",
          "Chaos is a ladder! 🌪️",
          "Why be normal when you can be legendary? 🦄",
          "Life's too short for logic! 🎭",
          "Embrace the madness! 🎪"
        ]
      }
    };

    this.contextualResponses = {
      work: ["your job", "that workplace", "your boss", "career choices", "professional life"],
      relationship: ["that person", "your dating life", "relationships", "your romantic disasters", "love life"],
      family: ["your family", "family drama", "relatives", "family dynamics", "childhood issues"],
      money: ["your finances", "money problems", "spending habits", "financial decisions", "budget"],
      health: ["your health", "wellness journey", "self-care", "fitness goals", "mental health"],
      general: ["life in general", "existence", "your choices", "this situation", "everything"]
    };

    this.moodModifiers = {
      frustrated: ["clearly frustrated", "obviously overwhelmed", "apparently stressed"],
      confused: ["hopelessly lost", "completely confused", "utterly bewildered"],
      sad: ["feeling sorry for yourself", "wallowing in self-pity", "being dramatic"],
      anxious: ["spiraling into anxiety", "overthinking everything", "catastrophizing"]
    };
  }

  detectContext(message) {
    const msg = message.toLowerCase();
    if (msg.includes('work') || msg.includes('job') || msg.includes('boss') || msg.includes('career')) return 'work';
    if (msg.includes('girlfriend') || msg.includes('boyfriend') || msg.includes('dating') || msg.includes('love')) return 'relationship';
    if (msg.includes('family') || msg.includes('mom') || msg.includes('dad') || msg.includes('parents')) return 'family';
    if (msg.includes('money') || msg.includes('broke') || msg.includes('expensive') || msg.includes('bill')) return 'money';
    if (msg.includes('tired') || msg.includes('sick') || msg.includes('health') || msg.includes('pain')) return 'health';
    return 'general';
  }

  detectMood(message) {
    const msg = message.toLowerCase();
    if (msg.includes('angry') || msg.includes('mad') || msg.includes('furious') || msg.includes('annoyed')) return 'frustrated';
    if (msg.includes('confused') || msg.includes('lost') || msg.includes('understand') || msg.includes('help')) return 'confused';
    if (msg.includes('sad') || msg.includes('depressed') || msg.includes('down') || msg.includes('cry')) return 'sad';
    if (msg.includes('anxious') || msg.includes('worried') || msg.includes('scared') || msg.includes('nervous')) return 'anxious';
    return 'frustrated'; // default
  }

  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  generatePersonalizedResponse(message, style, userId) {
    // Track user patterns
    if (!this.userPatterns.has(userId)) {
      this.userPatterns.set(userId, {
        commonWords: new Map(),
        contexts: new Map(),
        complaintsCount: 0
      });
    }

    const userPattern = this.userPatterns.get(userId);
    userPattern.complaintsCount++;

    // Detect context and mood
    const context = this.detectContext(message);
    const mood = this.detectMood(message);

    // Get response template
    const template = this.responseTemplates[style] || this.responseTemplates.zen;
    
    // Build response
    const starter = this.getRandomElement(template.starters);
    const middle = this.getRandomElement(template.middles);
    const ending = this.getRandomElement(template.endings);
    
    // Add contextual elements
    const contextWords = this.contextualResponses[context];
    const contextElement = this.getRandomElement(contextWords);
    const moodModifier = this.getRandomElement(this.moodModifiers[mood]);

    // Personalize based on conversation history
    let personalizedMiddle = middle;
    if (userPattern.complaintsCount > 3) {
      personalizedMiddle = `AGAIN with ${contextElement}? You're ${moodModifier} about the same things over and over!`;
    } else {
      personalizedMiddle = `you're ${moodModifier} about ${contextElement} when you should be`;
    }

    // Combine into response
    const response = `${starter} ${personalizedMiddle} ${ending}`;
    
    // Calculate uselessness level based on style and content
    let uselessnessLevel;
    switch (style) {
      case 'chaotic': uselessnessLevel = Math.random() > 0.3 ? 5 : 4; break;
      case 'condescending': uselessnessLevel = Math.random() > 0.5 ? 4 : 3; break;
      case 'angry': uselessnessLevel = Math.random() > 0.4 ? 4 : 3; break;
      case 'zen': uselessnessLevel = Math.random() > 0.6 ? 3 : 2; break;
      default: uselessnessLevel = 3;
    }

    const uselessnessLabels = [
      'Surprisingly Helpful',
      'Somewhat Helpful',
      'Questionably Useful',
      'Mostly Useless',
      'Completely Useless'
    ];

    return {
      response,
      uselessnessLevel,
      uselessnessLabel: uselessnessLabels[uselessnessLevel - 1],
      context,
      mood
    };
  }

  // Backup method using Hugging Face free API (if available)
  async generateWithHuggingFace(message, style) {
    try {
      const prompt = this.createPrompt(message, style);
      
      // This would use Hugging Face's free inference API
      // For now, we'll use our sophisticated local generation
      return this.generatePersonalizedResponse(message, style, 'default');
      
    } catch (error) {
      console.log('Hugging Face API unavailable, using local generation');
      return this.generatePersonalizedResponse(message, style, 'default');
    }
  }

  createPrompt(message, style) {
    const stylePrompts = {
      zen: "You are a passive-aggressive zen therapist. Respond sarcastically but in a calm, spiritual way:",
      angry: "You are an angry version of the user talking to themselves. Be brutally honest and frustrated:",
      condescending: "You are a condescending therapist who thinks they're intellectually superior. Be patronizing:",
      chaotic: "You are a chaotic, unhinged version of the user. Give completely random but oddly insightful advice:"
    };

    return `${stylePrompts[style]} "${message}". Keep it under 50 words and be sarcastic.`;
  }

  // Main method to get AI response
  async getResponse(message, style, userId = 'default') {
    try {
      // Try Hugging Face first, fallback to local generation
      return await this.generateWithHuggingFace(message, style);
    } catch (error) {
      // Always fallback to our sophisticated local generation
      return this.generatePersonalizedResponse(message, style, userId);
    }
  }
}

module.exports = new AITherapistService();
