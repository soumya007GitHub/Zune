import axios from "axios";
import { createContext } from "react";

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: "https://zune.onrender.com//"
})