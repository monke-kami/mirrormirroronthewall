"""
👤 Face Processor Service
Handles face detection, processing, and preparation for avatar generation.

"Finding faces so we can make them disappoint you in new ways."
"""

import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import os
import uuid
from typing import Dict, List, Tuple, Optional, Any
import json
from datetime import datetime


class FaceProcessorService:
    """
    Processes uploaded selfies and prepares them for deepfake avatar generation.
    Adds therapist accessories because why not make it worse?
    """
    
    def __init__(self):
        """Initialize face processing with OpenCV"""
        self.confidence_threshold = float(os.getenv('FACE_DETECTION_CONFIDENCE', 0.7))
        
        # Load OpenCV's pre-trained face detection model
        try:
            self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            self.eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        except Exception as e:
            print(f"Warning: Could not load face detection models: {e}")
            self.face_cascade = None
            self.eye_cascade = None
    
    def process_uploaded_image(self, image_file, upload_folder: str) -> Dict[str, Any]:
        """
        Process uploaded selfie and prepare it for avatar generation
        
        Args:
            image_file: Uploaded image file
            upload_folder (str): Directory to save processed images
            
        Returns:
            Dict with processing results and file paths
        """
        
        try:
            # Generate unique filename
            file_id = str(uuid.uuid4())
            original_filename = f"original_{file_id}.jpg"
            processed_filename = f"processed_{file_id}.jpg"
            
            original_path = os.path.join(upload_folder, original_filename)
            processed_path = os.path.join(upload_folder, processed_filename)
            
            # Save original image
            image_file.save(original_path)
            
            # Load and process image
            image = cv2.imread(original_path)
            if image is None:
                return {"error": "Could not read image file"}
            
            # Detect faces
            faces = self.detect_faces(image)
            
            if not faces:
                return {
                    "error": "No faces detected. Are you sure that's a selfie and not a landscape?",
                    "suggestion": "Try uploading a clearer photo with your face visible. We need something to work with here."
                }
            
            # Process the best face
            best_face = self.select_best_face(faces, image)
            processed_image = self.enhance_face_for_avatar(image, best_face)
            
            # Save processed image
            cv2.imwrite(processed_path, processed_image)
            
            # Extract face features for avatar customization
            face_features = self.extract_face_features(image, best_face)
            
            return {
                "success": True,
                "file_id": file_id,
                "original_path": original_path,
                "processed_path": processed_path,
                "face_data": {
                    "position": best_face,
                    "features": face_features,
                    "quality_score": self.assess_image_quality(image, best_face)
                },
                "avatar_ready": True,
                "message": "Face detected! Preparing for therapeutic roasting...",
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "error": f"Processing failed: {str(e)}",
                "suggestion": "Try a different image or check if the file is corrupted."
            }
    
    def detect_faces(self, image: np.ndarray) -> List[Tuple[int, int, int, int]]:
        """Detect faces in the image using OpenCV"""
        
        if self.face_cascade is None:
            # Fallback: assume the whole image is a face (not ideal but functional)
            h, w = image.shape[:2]
            return [(int(w*0.2), int(h*0.2), int(w*0.6), int(h*0.6))]
        
        # Convert to grayscale for face detection
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = self.face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30),
            flags=cv2.CASCADE_SCALE_IMAGE
        )
        
        return [(x, y, w, h) for x, y, w, h in faces]
    
    def select_best_face(self, faces: List[Tuple[int, int, int, int]], image: np.ndarray) -> Tuple[int, int, int, int]:
        """Select the best face from detected faces (largest, most centered)"""
        
        if not faces:
            return None
        
        if len(faces) == 1:
            return faces[0]
        
        # Score faces based on size and position
        h, w = image.shape[:2]
        center_x, center_y = w // 2, h // 2
        
        best_face = None
        best_score = -1
        
        for x, y, face_w, face_h in faces:
            # Size score (larger is better)
            size_score = (face_w * face_h) / (w * h)
            
            # Position score (closer to center is better)
            face_center_x = x + face_w // 2
            face_center_y = y + face_h // 2
            distance_from_center = np.sqrt((face_center_x - center_x)**2 + (face_center_y - center_y)**2)
            position_score = 1 - (distance_from_center / np.sqrt(center_x**2 + center_y**2))
            
            # Combined score
            total_score = size_score * 0.6 + position_score * 0.4
            
            if total_score > best_score:
                best_score = total_score
                best_face = (x, y, face_w, face_h)
        
        return best_face
    
    def enhance_face_for_avatar(self, image: np.ndarray, face_coords: Tuple[int, int, int, int]) -> np.ndarray:
        """Enhance the face region for better avatar generation"""
        
        # Create a copy to work with
        enhanced = image.copy()
        
        x, y, w, h = face_coords
        
        # Extract face region
        face_region = enhanced[y:y+h, x:x+w]
        
        # Apply enhancements
        # 1. Slight sharpening
        kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
        face_region = cv2.filter2D(face_region, -1, kernel)
        
        # 2. Brightness and contrast adjustment
        alpha = 1.1  # Contrast
        beta = 10    # Brightness
        face_region = cv2.convertScaleAbs(face_region, alpha=alpha, beta=beta)
        
        # 3. Put the enhanced face back
        enhanced[y:y+h, x:x+w] = face_region
        
        return enhanced
    
    def extract_face_features(self, image: np.ndarray, face_coords: Tuple[int, int, int, int]) -> Dict[str, Any]:
        """Extract facial features for avatar customization"""
        
        x, y, w, h = face_coords
        face_region = image[y:y+h, x:x+w]
        
        # Basic feature extraction
        features = {
            "face_width": w,
            "face_height": h,
            "aspect_ratio": w / h,
            "size_category": self._categorize_face_size(w, h, image.shape),
            "suggested_accessories": self._suggest_therapist_accessories(w, h)
        }
        
        # Detect eyes within face region
        if self.eye_cascade is not None:
            gray_face = cv2.cvtColor(face_region, cv2.COLOR_BGR2GRAY)
            eyes = self.eye_cascade.detectMultiScale(gray_face)
            features["eyes_detected"] = len(eyes)
            features["eye_positions"] = [(ex, ey, ew, eh) for ex, ey, ew, eh in eyes]
        else:
            features["eyes_detected"] = 2  # Assume 2 eyes
            features["eye_positions"] = []
        
        return features
    
    def _categorize_face_size(self, face_w: int, face_h: int, image_shape: Tuple[int, int]) -> str:
        """Categorize face size relative to image"""
        img_h, img_w = image_shape[:2]
        face_area_ratio = (face_w * face_h) / (img_w * img_h)
        
        if face_area_ratio > 0.3:
            return "large"
        elif face_area_ratio > 0.15:
            return "medium"
        else:
            return "small"
    
    def _suggest_therapist_accessories(self, face_w: int, face_h: int) -> List[str]:
        """Suggest therapist accessories based on face size"""
        accessories = []
        
        # Always suggest glasses - therapists love glasses
        accessories.append("therapist_glasses")
        
        # Suggest notepad based on face size
        if face_w > 200:
            accessories.append("notepad_large")
        else:
            accessories.append("notepad_small")
        
        # Add some personality
        accessories.extend([
            "judgmental_expression",
            "fake_diplomas_background",
            "uncomfortable_couch",
            "tissue_box_nearby"
        ])
        
        return accessories
    
    def assess_image_quality(self, image: np.ndarray, face_coords: Tuple[int, int, int, int]) -> Dict[str, Any]:
        """Assess the quality of the uploaded image for avatar generation"""
        
        x, y, w, h = face_coords
        face_region = image[y:y+h, x:x+w]
        
        # Calculate various quality metrics
        
        # 1. Sharpness (using Laplacian variance)
        gray_face = cv2.cvtColor(face_region, cv2.COLOR_BGR2GRAY)
        sharpness = cv2.Laplacian(gray_face, cv2.CV_64F).var()
        
        # 2. Brightness
        brightness = np.mean(gray_face)
        
        # 3. Contrast
        contrast = gray_face.std()
        
        # 4. Size adequacy
        size_score = min(1.0, (w * h) / (200 * 200))  # 200x200 is our minimum preferred size
        
        # Overall quality score
        quality_factors = {
            "sharpness": min(1.0, sharpness / 100),  # Normalize sharpness
            "brightness": 1.0 - abs(brightness - 127) / 127,  # Optimal brightness around 127
            "contrast": min(1.0, contrast / 50),  # Normalize contrast
            "size": size_score
        }
        
        overall_score = np.mean(list(quality_factors.values()))
        
        # Quality rating
        if overall_score >= 0.8:
            rating = "Excellent - Ready for premium roasting!"
        elif overall_score >= 0.6:
            rating = "Good - Suitable for standard therapy mockery"
        elif overall_score >= 0.4:
            rating = "Fair - Might need some enhancement"
        else:
            rating = "Poor - Consider retaking the photo"
        
        return {
            "overall_score": overall_score,
            "rating": rating,
            "factors": quality_factors,
            "recommendations": self._get_quality_recommendations(quality_factors)
        }
    
    def _get_quality_recommendations(self, quality_factors: Dict[str, float]) -> List[str]:
        """Provide recommendations for improving image quality"""
        recommendations = []
        
        if quality_factors["sharpness"] < 0.5:
            recommendations.append("Image appears blurry - try taking a sharper photo")
        
        if quality_factors["brightness"] < 0.5:
            recommendations.append("Image is too dark or too bright - adjust lighting")
        
        if quality_factors["contrast"] < 0.5:
            recommendations.append("Low contrast - try better lighting conditions")
        
        if quality_factors["size"] < 0.7:
            recommendations.append("Face appears small in image - try getting closer to camera")
        
        if not recommendations:
            recommendations.append("Image quality is good - ready for avatar generation!")
        
        return recommendations
    
    def prepare_for_deepfake(self, processed_image_path: str, face_features: Dict) -> Dict[str, Any]:
        """Prepare the processed image for deepfake generation"""
        
        # This would integrate with actual deepfake libraries
        # For now, we'll return metadata for avatar generation
        
        return {
            "deepfake_ready": True,
            "input_path": processed_image_path,
            "recommended_settings": {
                "face_size": face_features.get("size_category", "medium"),
                "enhancement_level": "standard",
                "accessories": face_features.get("suggested_accessories", [])
            },
            "estimated_processing_time": "2-3 minutes",
            "note": "Ready for therapeutic avatar generation!"
        }
