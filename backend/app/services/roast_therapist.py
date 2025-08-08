"""
🎭 RoastGPT Therapy Service
The core AI engine that delivers hilariously unhelpful therapy advice.

"Combining the wisdom of therapy with the emotional intelligence of a toaster."
"""

import openai
import os
import random
from datetime import datetime
from typing import Dict, List, Tuple, Any


class RoastTherapistService:
    """
    The heart of our fake therapy app - generates sarcastic, unhelpful,
    but hilarious therapy responses that roast the user... gently(ish).
    """
    
    def __init__(self):
        """Initialize the roast therapist with maximum sarcasm"""
        openai.api_key = os.getenv('OPENAI_API_KEY')
        self.sarcasm_level = float(os.getenv('THERAPY_SARCASM_LEVEL', 0.8))
        self.roast_intensity = float(os.getenv('ROAST_INTENSITY', 0.9))
        
        # Therapy clichés and roast templates
        self.therapy_openers = [
            "Interesting. Let's unpack that... or maybe let's not.",
            "I'm hearing a lot of projection here. Not the good kind.",
            "How does that make you feel? Wait, don't tell me, I can guess.",
            "That's... certainly a choice you've made.",
            "Let's explore this deeper... actually, maybe let's not go there.",
        ]
        
        self.roast_endings = [
            "But hey, at least you're consistent.",
            "Just a thought from your clearly superior inner self.",
            "This has been another session of 'stating the obvious'.",
            "Progress! ...is something we'll work on eventually.",
            "Remember: I'm you, so this is really self-criticism.",
        ]
        
        self.therapy_wisdom = [
            "Maybe the real therapy was the friends we annoyed along the way.",
            "Have you tried... not being like this?",
            "Your problems are valid. Solving them, however...",
            "It's not you, it's... actually, no, it's definitely you.",
            "I prescribe one serving of 'getting over it' with a side of perspective.",
        ]

    def generate_therapy_response(self, user_message: str) -> Dict[str, Any]:
        """
        Generate a hilariously unhelpful therapy response
        
        Args:
            user_message (str): The user's therapy input
            
        Returns:
            Dict containing the response, advice type, and roast level
        """
        
        # If OpenAI is not configured, use our built-in roast responses
        if not openai.api_key or openai.api_key == "your_openai_api_key_here":
            return self._generate_local_roast_response(user_message)
        
        try:
            # Craft the perfect prompt for maximum therapeutic uselessness
            prompt = self._create_roast_therapy_prompt(user_message)
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system", 
                        "content": prompt["system"]
                    },
                    {
                        "role": "user", 
                        "content": prompt["user"]
                    }
                ],
                max_tokens=200,
                temperature=0.9,  # Maximum creativity for maximum chaos
                presence_penalty=0.6,
                frequency_penalty=0.6
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            return {
                "response": ai_response,
                "advice_type": self._classify_advice_type(ai_response),
                "roast_level": self._calculate_roast_level(ai_response),
                "wisdom_rating": "🍕 Pizza-tier nonsense",
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            # Fallback to local roasting if AI fails
            return self._generate_local_roast_response(user_message)

    def _create_roast_therapy_prompt(self, user_message: str) -> Dict[str, str]:
        """Create the perfect prompt for therapeutic roasting"""
        
        system_prompt = f"""
        You are a therapist who is literally the user talking to themselves in a mirror. 
        You are sarcastic, slightly condescending, but oddly insightful. You give advice 
        that's technically correct but delivered with the emotional warmth of a refrigerator.
        
        Rules:
        1. Be sarcastic but not cruel
        2. Mix genuine therapy concepts with humor
        3. Use therapy clichés ironically
        4. Act like you're the user's inner voice that's tired of their nonsense
        5. Keep responses under 150 words
        6. End with a backhanded compliment or obvious observation
        
        Sarcasm Level: {self.sarcasm_level}/1.0
        Roast Intensity: {self.roast_intensity}/1.0
        """
        
        user_prompt = f"""
        The user (who is also you) says: "{user_message}"
        
        Respond as their own reflection giving therapy advice that's technically helpful 
        but delivered with maximum sarcasm and minimal emotional support.
        """
        
        return {
            "system": system_prompt,
            "user": user_prompt
        }

    def _generate_local_roast_response(self, user_message: str) -> Dict[str, Any]:
        """Generate response using local templates when AI is unavailable"""
        
        # Simple keyword-based responses for demo purposes
        keywords = user_message.lower()
        
        if any(word in keywords for word in ['sad', 'depressed', 'down']):
            response = f"{random.choice(self.therapy_openers)} Feeling sad? Revolutionary. Have you tried... not doing that? {random.choice(self.roast_endings)}"
        elif any(word in keywords for word in ['work', 'job', 'boss']):
            response = f"Work problems? Shocking. Maybe if you spent less time complaining and more time... working? {random.choice(self.roast_endings)}"
        elif any(word in keywords for word in ['relationship', 'dating', 'love']):
            response = f"Relationship issues? With that attitude? I'm stunned. {random.choice(self.therapy_wisdom)}"
        elif any(word in keywords for word in ['anxiety', 'worried', 'stress']):
            response = f"Anxiety, you say? Have you tried just... calming down? Revolutionary concept, I know. {random.choice(self.roast_endings)}"
        else:
            response = f"{random.choice(self.therapy_openers)} {random.choice(self.therapy_wisdom)} {random.choice(self.roast_endings)}"
        
        return {
            "response": response,
            "advice_type": "Classic Mirror Roast",
            "roast_level": random.uniform(0.6, 0.9),
            "wisdom_rating": "🍕 Pizza-tier nonsense",
            "timestamp": datetime.now().isoformat()
        }

    def _classify_advice_type(self, response: str) -> str:
        """Classify the type of 'advice' given"""
        response_lower = response.lower()
        
        if any(word in response_lower for word in ['try', 'maybe', 'consider']):
            return "Backhanded Suggestion"
        elif any(word in response_lower for word in ['obvious', 'clearly', 'obviously']):
            return "Stating the Obvious"
        elif '?' in response:
            return "Rhetorical Questioning"
        elif any(word in response_lower for word in ['feel', 'emotion', 'feeling']):
            return "Emotional Invalidation"
        else:
            return "General Roasting"

    def _calculate_roast_level(self, response: str) -> float:
        """Calculate how much roasting is in the response"""
        roast_indicators = [
            'really', 'seriously', 'honestly', 'maybe try', 'have you considered',
            'shocking', 'revolutionary', 'amazing', 'stunning', 'incredible'
        ]
        
        roast_count = sum(1 for indicator in roast_indicators 
                         if indicator in response.lower())
        
        return min(0.9, roast_count * 0.2 + 0.3)

    def calculate_uselessness_score(self, response_data: Dict) -> Dict[str, Any]:
        """Calculate how useless the therapy advice is (higher = funnier)"""
        
        if isinstance(response_data, str):
            response = response_data
        else:
            response = response_data.get('response', '')
        
        # Uselessness indicators
        useless_words = ['just', 'try', 'maybe', 'simply', 'obviously', 'clearly']
        cliche_count = sum(1 for word in useless_words if word in response.lower())
        
        question_marks = response.count('?')
        sarcasm_indicators = response.count('...') + response.count('Really?')
        
        raw_score = (cliche_count * 0.2) + (question_marks * 0.3) + (sarcasm_indicators * 0.4)
        normalized_score = min(1.0, raw_score)
        
        # Fun rating system
        if normalized_score >= 0.8:
            rating = "🔥 Maximum Uselessness Achieved"
        elif normalized_score >= 0.6:
            rating = "🍕 Pizza-tier Advice"
        elif normalized_score >= 0.4:
            rating = "🤷 Mildly Unhelpful"
        else:
            rating = "😴 Surprisingly Reasonable"
        
        return {
            "score": normalized_score,
            "rating": rating,
            "breakdown": {
                "cliches": cliche_count,
                "rhetorical_questions": question_marks,
                "sarcasm_level": sarcasm_indicators
            }
        }

    def get_session_summary(self, messages: List[Dict]) -> Dict[str, Any]:
        """Generate a summary of the therapy session"""
        
        total_messages = len(messages)
        total_uselessness = sum(msg.get('useless_meter', {}).get('score', 0) 
                              for msg in messages if 'useless_meter' in msg)
        
        avg_uselessness = total_uselessness / total_messages if total_messages > 0 else 0
        
        return {
            "session_length": total_messages,
            "average_uselessness": avg_uselessness,
            "overall_rating": "Another successful session of achieving nothing",
            "recommendation": "Try talking to an actual therapist... or a houseplant. Both might be more helpful.",
            "bill": "$0.00 (you get what you pay for)"
        }
