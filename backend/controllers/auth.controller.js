import cloudinary from "../config/cloudinary.js";
import { genToken } from "../config/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

export const signup = async (req,res) => {
    let {fullname, password, email} = req.body;
    try{
        if(!fullname || !password || !email){
            return res.status(400).json({message : "All fields are required"});
        }

        if(password.length < 6){
            return res.status(400).json({message : "Password must be atleast 6 characters"});
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message : "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullname,
            email,
            password: hashPass,
        })

        if(newUser){
            genToken(newUser._id, res);
            res.status(200).json(newUser);
        }
        else{
            res.status(400).json({message: "Invalid user Data"});
        }

    }
    catch(error){
        console.log("Error in signup controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const login = async (req,res) => {
    try {
        let {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({message : "All fields required"});
        }

        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message : "Invalid Credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message : "Invalid Credentials"});
        }

        genToken(user._id, res);
        res.status(200).json(user);
    }
    catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }

}

export const logout = (req,res) => {
    try {
        res.cookie('token', "");
        res.status(200).json({message : "User logged out successfully"});
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const update = async (req, res) => {
    try{
        const { profilepic } = req.body;
        const userId = req.user._id;

        if(!profilepic){
            return res.status(400).json({ message : "profile pic is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilepic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilepic: uploadResponse.secure_url}, {new : true});
        res.status(200).json(updatedUser);
    }
    catch(error){
        console.log("Error in update controller", error.message);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export const checkAuth = (req, res) => {
    try{    
        res.status(200).json(req.user)
    }
    catch(error){
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({message : "Internal Server Error"});
    }
}