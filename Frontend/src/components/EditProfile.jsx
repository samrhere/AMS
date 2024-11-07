import React, { useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../store/userSlice";

const EditProfile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  
  
  const dispatch = useDispatch();

  const [img, setImg] = useState(currentUser.profilePicture);
  const imgRef = useRef(null);
  const dialogRef = useRef(null);

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [location, setLocation] = useState(currentUser.location);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch("/api/user/edit-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profilePicture: img,
          username,
          email,
          location,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        dispatch(updateUserFailure(data.message));
        console.error(data.message);
      } else {
        dispatch(updateUserSuccess(data));
      
        dialogRef.current.close();
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      console.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="modal-box p-8 w-full max-w-md bg-white rounded-lg shadow-lg">
        <form onSubmit={handleUpdateProfile} className="flex flex-col space-y-6">
          <div className="flex justify-center items-center mb-4">
            <div className="relative">
              <img
                src={img}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                alt="Profile"
              />
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImgChange}
                ref={imgRef}
              />
              <div
                className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition duration-200"
                onClick={() => imgRef.current.click()}
              >
                <MdEdit className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </div>
          <input
            className="border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 transition-all duration-200"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 transition-all duration-200"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition-all duration-300 shadow-md"
          >
            {loading ? "Editing..." : "Edit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;


// // src/pages/EditProfile.js
// import React, { useState } from 'react';
// //import api from '../api'; // Make sure this points to your API setup

// function EditProfile() {
//   const [profileData, setProfileData] = useState({
//     username: '',
//     email: '',
//   });
//   const [profilePicture, setProfilePicture] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = {
//         ...profileData,
//         profilePicture,
//       };
      
//       //await api.put('/user/edit-profile', formData);

//       // const formData = {
//       //   ...profileData,
//       //   profilePicture, // Directly sending base64 data to the server
//       // };
//       // await api.put('/user/edit-profile', formData);
//       alert('Profile updated successfully!');
//     } catch (error) {
//       alert('Error updating profile');
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = () => {
//       setProfilePicture(reader.result); // Set base64 string
//     };
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
//         <h2 className="text-2xl mb-4">Edit Profile</h2>
//         <input
//           type="text"
//           placeholder="Username"
//           value={profileData.username}
//           onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
//           className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={profileData.email}
//           onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
//           className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
//         />
//         <label className="block mb-2">Profile Picture</label>
//         <input
//           type="file"
//           onChange={handleFileChange}
//           className="mb-4"
//         />
//         <button
//           type="submit"
//           className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900"
//         >
//           Update Profile
//         </button>
//       </form>
//     </div>
//   );
// }

// export default EditProfile;
