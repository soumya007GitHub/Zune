import express from "express";

const router = express.Router();

router.get("/login", (req, res)=>{
    res.send("User route");
});
router.get("/register", (req, res)=>{
    res.send("User route");
});
router.get("/add_to_activity", (req, res)=>{
    res.send("User route");
});
router.get("/get_all_activity", (req, res)=>{
    res.send("User route");
});

export default router;