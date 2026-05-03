import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';

const login = async(req, res)=>{
    const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).json({msg:"All parameters are required."});
    }
    try{
        let userExists = await User.findOne({ username });
        if(!userExists){
            return res.status(404).json({ msg: "Credentials are incorrect." });
        }
        const hashedPwd = userExists.password;
        const isMatch = await bcrypt.compare(password, hashedPwd);
        if(isMatch){
            const token = jwt.sign(
                {userId: userExists._id, username: userExists.username},
                process.env.JWT_SECRET,
                {expiresIn: '1h'} 
            );
            userExists.token = token;
            await userExists.save();
            return res.status(200).json({
                msg: "Login successful",
                token: token
            })
        }else{
            return res.status(401).json({msg: "Password is incorrect"});
        }
    }catch(err){
        console.log(err);
        return res.status(400).json({msg: "Something went wrong"});
    }
}
const register = async (req, res) => {
    const { name, username, password } = req.body;
    try {
        let userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(409).json({ msg: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({name, username, password: hashedPassword});
        await newUser.save();
        return res.status(201).json({msg:"Account created succesfully"});
    }
    catch (err) {
        return res.status(400).json(err);
    }
};

export {login,register};