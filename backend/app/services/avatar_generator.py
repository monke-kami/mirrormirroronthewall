"""
🎭 Avatar Generator Service
Creates deepfake therapist avatars with maximum therapeutic uselessness.

"Generating your worst self to give you the advice you don't want to hear."
"""

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import os
import uuid
import json
from datetime import datetime
from typing import Dict, List, Tuple, Optional, Any
import random


class AvatarGeneratorService:
    """
    Generates therapist avatars from user photos with added accessories
    and prepares them for the therapeutic roasting experience.
    """
    
    def __init__(self):
        """Initialize avatar generation service"""
        self.avatar_folder = os.getenv('AVATAR_FOLDER', '../generated_avatars')
        self.therapist_modes = [
            "condescending",
            "overly_supportive", 
            "brutally_honest",
            "passive_aggressive",
            "confused_intern"
        ]
        
        # Mock deepfake settings (in real implementation, this would connect to actual deepfake models)
        self.deepfake_settings = {
            "face_swap_quality": "premium_disappointment",
            "expression_range": ["slight_smirk", "eye_roll", "concerned_frown", "fake_smile"],
            "voice_tone": "your_own_voice_but_judgmental"
        }
    
    def generate_therapist_avatar(self, face_data: Dict, customization: Dict = None) -> Dict[str, Any]:
        """
        Generate a therapist avatar from processed face data
        
        Args:
            face_data (Dict): Processed face data from FaceProcessorService
            customization (Dict): User customization preferences
            
        Returns:
            Dict with avatar generation results
        """
        
        try:
            avatar_id = str(uuid.uuid4())
            
            # Load the processed image
            processed_path = face_data.get('processed_path')
            if not processed_path or not os.path.exists(processed_path):
                return {"error": "Processed image not found"}
            
            # Generate avatar variants
            avatar_variants = self._create_avatar_variants(processed_path, face_data, customization)
            
            # Create therapist persona
            persona = self._generate_therapist_persona(face_data.get('features', {}))
            
            # Prepare avatar metadata
            avatar_metadata = {
                "avatar_id": avatar_id,
                "source_image": processed_path,
                "variants": avatar_variants,
                "persona": persona,
                "therapy_style": random.choice(self.therapist_modes),
                "specializations": self._generate_fake_specializations(),
                "generated_at": datetime.now().isoformat(),
                "status": "ready_for_disappointment"
            }
            
            # Save avatar metadata
            metadata_path = os.path.join(self.avatar_folder, f"avatar_{avatar_id}.json")
            with open(metadata_path, 'w') as f:
                json.dump(avatar_metadata, f, indent=2)
            
            return {
                "success": True,
                "avatar_id": avatar_id,
                "metadata": avatar_metadata,
                "preview_url": avatar_variants[0]["file_path"],  # Use first variant as preview
                "message": "Avatar generated! Your therapist self is ready to disappoint you.",
                "estimated_roast_quality": "Premium grade disappointment"
            }
            
        except Exception as e:
            return {
                "error": f"Avatar generation failed: {str(e)}",
                "suggestion": "Try a different photo or pray to the tech gods."
            }
    
    def _create_avatar_variants(self, image_path: str, face_data: Dict, customization: Dict = None) -> List[Dict]:
        """Create different avatar variants with therapist accessories"""
        
        variants = []
        base_image = cv2.imread(image_path)
        
        if base_image is None:
            return []
        
        # Convert to PIL for easier manipulation
        pil_image = Image.fromarray(cv2.cvtColor(base_image, cv2.COLOR_BGR2RGB))
        
        # Generate different variants
        variant_configs = [
            {"name": "Classic Therapist", "accessories": ["glasses", "notepad"], "mood": "professional_disappointment"},
            {"name": "Concerned You", "accessories": ["glasses", "tissue_box"], "mood": "fake_empathy"},
            {"name": "Judgmental You", "accessories": ["reading_glasses", "thick_file"], "mood": "silent_judgment"},
            {"name": "Overly Cheerful You", "accessories": ["bright_smile", "motivational_poster"], "mood": "toxic_positivity"}
        ]
        
        for i, config in enumerate(variant_configs):
            variant_image = self._add_therapist_accessories(pil_image.copy(), config, face_data)
            
            # Save variant
            variant_filename = f"avatar_variant_{uuid.uuid4().hex[:8]}.jpg"
            variant_path = os.path.join(self.avatar_folder, variant_filename)
            variant_image.save(variant_path, quality=95)
            
            variants.append({
                "variant_id": i + 1,
                "name": config["name"],
                "file_path": variant_path,
                "mood": config["mood"],
                "accessories": config["accessories"],
                "therapy_effectiveness": "Questionable at best"
            })
        
        return variants
    
    def _add_therapist_accessories(self, image: Image.Image, config: Dict, face_data: Dict) -> Image.Image:
        """Add therapist accessories to the avatar image"""
        
        # Create a drawing context
        draw = ImageDraw.Draw(image)
        width, height = image.size
        
        # Get face position
        face_features = face_data.get('features', {})
        face_pos = face_data.get('position', (width//4, height//4, width//2, height//2))
        x, y, w, h = face_pos
        
        # Add accessories based on configuration
        accessories = config.get('accessories', [])
        
        if 'glasses' in accessories:
            self._add_glasses(draw, x, y, w, h)
        
        if 'notepad' in accessories:
            self._add_notepad(draw, width, height)
        
        if 'tissue_box' in accessories:
            self._add_tissue_box(draw, width, height)
        
        # Add mood-based modifications
        mood = config.get('mood', 'neutral')
        self._apply_mood_filter(image, mood)
        
        return image
    
    def _add_glasses(self, draw: ImageDraw.Draw, face_x: int, face_y: int, face_w: int, face_h: int):
        """Add therapist glasses to the face"""
        
        # Calculate glasses position (approximate eye level)
        glasses_y = face_y + int(face_h * 0.4)
        glasses_x = face_x + int(face_w * 0.1)
        glasses_w = int(face_w * 0.8)
        glasses_h = int(face_h * 0.25)
        
        # Draw simple glasses frame
        draw.rectangle([glasses_x, glasses_y, glasses_x + glasses_w, glasses_y + glasses_h], 
                      outline="black", width=3)
        
        # Draw lens separation
        center_x = glasses_x + glasses_w // 2
        draw.line([center_x, glasses_y, center_x, glasses_y + glasses_h], fill="black", width=2)
        
        # Add "intellectual" text overlay
        try:
            # This would use a proper font in production
            draw.text((face_x, face_y - 30), "Dr. You, PhD in Disappointment", fill="black")
        except:
            pass  # Font loading might fail, that's okay
    
    def _add_notepad(self, draw: ImageDraw.Draw, width: int, height: int):
        """Add a therapist notepad to the image"""
        
        # Notepad position (bottom right corner)
        pad_w, pad_h = width // 6, height // 8
        pad_x = width - pad_w - 20
        pad_y = height - pad_h - 20
        
        # Draw notepad
        draw.rectangle([pad_x, pad_y, pad_x + pad_w, pad_y + pad_h], fill="white", outline="black")
        
        # Add "notes" (just lines)
        for i in range(3):
            line_y = pad_y + 10 + (i * 8)
            draw.line([pad_x + 5, line_y, pad_x + pad_w - 5, line_y], fill="blue", width=1)
        
        # Add judgemental "notes"
        try:
            draw.text((pad_x + 5, pad_y + 35), "Patient: Hopeless", fill="black")
        except:
            pass
    
    def _add_tissue_box(self, draw: ImageDraw.Draw, width: int, height: int):
        """Add a tissue box for the inevitable tears"""
        
        box_w, box_h = 60, 40
        box_x = 20
        box_y = height - box_h - 20
        
        # Draw tissue box
        draw.rectangle([box_x, box_y, box_x + box_w, box_y + box_h], fill="lightblue", outline="blue")
        
        # Add label
        try:
            draw.text((box_x + 5, box_y + 15), "Tissues", fill="darkblue")
            draw.text((box_x + 5, box_y + 25), "(You'll need them)", fill="darkblue")
        except:
            pass
    
    def _apply_mood_filter(self, image: Image.Image, mood: str):
        """Apply mood-based visual filters"""
        
        # This is a placeholder for mood-based image processing
        # In a real implementation, you might adjust colors, add overlays, etc.
        
        if mood == "professional_disappointment":
            # Slightly desaturate for that clinical feel
            enhancer = Image.ImageEnhance.Color(image)
            image = enhancer.enhance(0.8)
        
        elif mood == "fake_empathy":
            # Slightly warmer tones
            enhancer = Image.ImageEnhance.Color(image)
            image = enhancer.enhance(1.1)
        
        # Add more mood filters as needed
        
        return image
    
    def _generate_therapist_persona(self, face_features: Dict) -> Dict[str, Any]:
        """Generate a therapist persona based on face features"""
        
        # Randomize persona traits based on "analysis"
        face_size = face_features.get('size_category', 'medium')
        aspect_ratio = face_features.get('aspect_ratio', 1.0)
        
        # "Scientific" persona generation
        if face_size == 'large':
            confidence = "Overconfident"
            specialty = "Making everything about childhood"
        elif face_size == 'small':
            confidence = "Compensating with big words"
            specialty = "Projection and deflection"
        else:
            confidence = "Appropriately disappointing"
            specialty = "Generic life advice"
        
        persona = {
            "confidence_level": confidence,
            "primary_specialty": specialty,
            "therapy_approach": random.choice([
                "Aggressive mindfulness",
                "Passive-aggressive cognitive behavioral therapy",
                "Interpretive dance therapy (without the dancing)",
                "Solution-focused problem creation",
                "Mindfulness-based stress addition"
            ]),
            "catchphrase": random.choice([
                "How does that make you feel? Don't answer that.",
                "Let's unpack that... actually, let's not.",
                "I'm sensing some resistance... good instincts.",
                "That's... interesting. Moving on.",
                "Have you tried just... not?"
            ]),
            "qualifications": [
                "PhD in Stating the Obvious",
                "Masters in Emotional Unavailability", 
                "Certificate in Professional Disappointment",
                "Licensed to Judge (self-issued)"
            ],
            "therapy_success_rate": f"{random.randint(5, 15)}% (margin of error: ±100%)"
        }
        
        return persona
    
    def _generate_fake_specializations(self) -> List[str]:
        """Generate hilariously fake therapy specializations"""
        
        specializations = [
            "Imposter Syndrome (Certified Expert)",
            "Decision Paralysis (Still deciding if I'm qualified)",
            "Overthinking Everything (I've thought about this a lot)",
            "Social Anxiety (Ironically, in a social profession)",
            "Perfectionism (This response could be better)",
            "Procrastination (I'll get to this later)",
            "Work-Life Balance (Currently working 24/7)",
            "Self-Care (Do as I say, not as I do)"
        ]
        
        return random.sample(specializations, random.randint(2, 4))
    
    def get_avatar_info(self, avatar_id: str) -> Dict[str, Any]:
        """Retrieve avatar information by ID"""
        
        metadata_path = os.path.join(self.avatar_folder, f"avatar_{avatar_id}.json")
        
        if not os.path.exists(metadata_path):
            return {"error": "Avatar not found. Did it get therapy and leave?"}
        
        try:
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
            
            return {
                "success": True,
                "avatar_data": metadata,
                "status": "Ready for therapeutic disappointment"
            }
            
        except Exception as e:
            return {"error": f"Could not load avatar data: {str(e)}"}
    
    def customize_avatar(self, avatar_id: str, customizations: Dict) -> Dict[str, Any]:
        """Apply customizations to existing avatar"""
        
        # Load existing avatar data
        avatar_info = self.get_avatar_info(avatar_id)
        
        if not avatar_info.get('success'):
            return avatar_info
        
        # Apply customizations (placeholder implementation)
        avatar_data = avatar_info['avatar_data']
        
        # Update persona based on customizations
        if 'therapy_style' in customizations:
            avatar_data['therapy_style'] = customizations['therapy_style']
        
        if 'sarcasm_level' in customizations:
            avatar_data['persona']['sarcasm_level'] = customizations['sarcasm_level']
        
        # Save updated metadata
        metadata_path = os.path.join(self.avatar_folder, f"avatar_{avatar_id}.json")
        with open(metadata_path, 'w') as f:
            json.dump(avatar_data, f, indent=2)
        
        return {
            "success": True,
            "message": "Avatar customized! Now even more disappointing than before.",
            "updated_avatar": avatar_data
        }
    
    def generate_avatar_preview_video(self, avatar_id: str) -> Dict[str, Any]:
        """Generate a preview video of the avatar (mock implementation)"""
        
        # In a real implementation, this would use deepfake video generation
        # For now, return metadata for a mock video
        
        video_id = str(uuid.uuid4())
        
        return {
            "video_id": video_id,
            "status": "generating",
            "estimated_completion": "2-3 minutes",
            "preview_frames": [
                "frame_1_disappointed_look.jpg",
                "frame_2_fake_concern.jpg", 
                "frame_3_eye_roll.jpg",
                "frame_4_condescending_smile.jpg"
            ],
            "message": "Generating your therapeutic doppelganger...",
            "warning": "Results may cause existential crisis"
        }
