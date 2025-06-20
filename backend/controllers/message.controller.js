import cloudinary from "../config/cloudinary.js";
import { io, getRecieverSocketId } from "../config/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const usersForSideBar = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({
            _id: {
                $ne: loggedInUserId
            }
        })
        .select("-password");

        res.status(200).json(filteredUsers);
    }
    catch(error){
        console.log("Error in usersForSideBarController", error.message);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export const getMessages = async (req, res) => {
    try{
        const { id:userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId:myId, recieverId:userToChatId},
                {senderId:userToChatId, recieverId:myId}
            ]
        })

        res.status(200).json(messages);
    }
    catch(error){
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export const sendMessage = async (req, res) => {
    try{
        let {text, image} = req.body;
        const recieverId = req.params.id;
        const senderId = req.user._id;

        let imageurl = null;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageurl = uploadResponse.secure_url;
        }

        const message = await Message.create({
            senderId,
            recieverId,
            image : imageurl,
            text,
        })

        const recieverSocketId = getRecieverSocketId(recieverId);
        if(recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", message)
        }

        res.status(200).json(message);
    }   
    catch(error){
        console.log("Error in sendMessages controller", error.message);
        res.status(500).json({message : "Internal Server Error"});
    }
}