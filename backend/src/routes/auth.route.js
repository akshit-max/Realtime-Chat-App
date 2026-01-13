import express from "express";
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// router.use(arcjetProtection);// every function signup,login,logout,update profile now using this arcjet common to all

// router.get("/test", arcjetProtection,(req,res)=>{
//     res.status(200).send({message:"hi"})
// });
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);


// Access the page 
router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));

export default router;
