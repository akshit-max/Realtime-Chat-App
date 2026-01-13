import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
// ----------------------------------------------------------------------------------------
export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;  //using req.user._id not simply user.id is because of protected route
    // filter user are  those which are not  $ne means not equal to or other than us  and also -password means we dont
    //  want to send the password back to client
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password"); // filter user other than us 
    // if not used it will take us also 

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ----------------------------------------------------------------------------------
export const getMessagesByUserId = async (req, res) => {
  try {

//     This means:

// Take req.params.id

// Rename it to userToChatId


    const myId = req.user._id;// my id
    const { id: userToChatId } = req.params;// getting id from params look in schema  id is coming from user whom we are talking to
    
      
    // me and you 
    // i send you the message 
    // you send me the message

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};






export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;// recieved id is the others user id which is getting 
    // from params name it as recieved ID
    const senderId = req.user._id;  // we are using req.user not just user because of validation middleware

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;
    if (image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }


    //  save details in schema 
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();


// 👉 In a MERN app, MongoDB generates the id automatically when a document is created.


// ---------------------------------------------------------------------------------------------------------------
  // send msg in real time when user is online using socket io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
// ----------------------------------------------------------------------------------------------------
   


res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};





// we can have a lots of contact so how do we find whom we are talking to who is there in the chats we cant show all of them
// just like in whatsapp

// lets find chat in which 
// sender is us
// reciever is us

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // find all the messages where the logged-in user is either sender or receiver from message database collection
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];


      
    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
