import express from "express";
import {login, register, verifyToken} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register",register);
router.get("/verifyToken", verifyToken, (req, res) => {
  res.status(200).json({ valid: true, user: req.user });
});
router.get("/add_to_activity", (req, res)=>{
    res.send("User route");
});
router.get("/get_all_activity", (req, res)=>{
    res.send("User route");
});

export default router;