import { User } from "../models/User.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from "cloudinary"
import bcrypt from 'bcryptjs'


export const register = async (req, res, next) => {
    try {
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email

        const { username, password, email, role } = req.body


        if (!username || !password || !email || !role) {
            return next(errorHandler(400, "All fields are required!"))
        }

        if (!emailRegex.test(email)) {
            return next(errorHandler(400, "Email is invalid!"))
        }

        if (password.length < 8) {
            return next(errorHandler(400, "The Password At Least 8 characters!"));
        }

        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
            return next(errorHandler(409, "Email already exist"));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        })


        const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
            expiresIn: "15d",
        });

        const oneDay = 1000 * 60 * 60 * 24;

        res
            .cookie("token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + oneDay),
            })
            .status(201)
            .json(user);
    } catch (error) {
        next(error)
        console.log(error.message);

    }
}

export const login = async (req, res, next) => {
   
    
    const { email, password } = req.body;
    
    
  if (!email || !password) {
    return next(errorHandler(400, "All Fields Are Required!"));
  }
  try {
    const isUser = await User.findOne({ email });

    if (!isUser) {
      return next(errorHandler(404, "User not found!"));
    }

    const isCorrectPassword = await bcrypt.compare(password, isUser.password);

    if (!isCorrectPassword) {
      return next(errorHandler(400, "invalid credentials"));
    }

    const token = jwt.sign({ userId: isUser._id }, process.env.SECRET, {
      expiresIn: "15d",
    });

    const user = await User.findById(isUser._id).select("-password");

    const oneDay = 1000 * 60 * 60 * 24;
    res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
      })
      .status(200)
      .json(user);
  } catch (error) {
    next(error);
    console.log(error.message);
  }
}

export const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json("log out");
};