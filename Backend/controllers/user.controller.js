import { User } from "../models/User.model.js";
import { v2 as cloudinary } from "cloudinary";

export const editProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { username, email, profilePicture } = req.body;
    
        let uploadedImageUrl = null;
        if (profilePicture) {
          const uploadResult = await cloudinary.uploader.upload(profilePicture, {
            folder: 'profile_pictures',
            public_id: `user_${userId}`,
          });
          uploadedImageUrl = uploadResult.secure_url;
        }
    
        const updates = {
          username,
          email,
          profilePicture: uploadedImageUrl || undefined, // Only update if a new picture is uploaded
        };
    
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
      } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
      }
}
