import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { Request, Response } from "express";
import User from '../models/User';
const JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}";
const JWT_REFRESH_SECRET = "{asdfasdfdsfa-B794-4A04-89DD-15FE7FDBFF78}";
const registerUser = async (req: Request, res: Response, next: any) => {
    console.log("LOGIN ")
    // res.send("LOGGED ")
    const { username, password: plainTextPassword } = req.body;

    if (!username || typeof username !== "string") {
      return res.json({ status: "error", error: "Invalid username" });
    }
  
    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      return res.json({ status: "error", error: "Invalid password" });
    }
  
    if (plainTextPassword.length < 5) {
      return res.json({
        status: "error",
        error: "Password too small. Should be atleast 6 characters"
      });
    }
  
    const password = await bcrypt.hash(plainTextPassword, 10);
  
    try {
      const response = await User.create({
        username,
        password
      });
      console.log("User created successfully: ", response);
    } catch (error : any) {
      if (error.code === 11000) {
        // duplicate key
        return res.json({ status: "error", error: "Username already in use" });
      }
      throw error;
    }
  
    res.json({ status: "ok" });
}

const loginUser = async (req: Request, res: Response, next: any) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }).lean();
    
        if (!user) {
          return res.json({ status: "error", error: "Invalid username/password" });
        }
        const saltedPassword = user.password;
        const successResult = await bcrypt.compare(password, saltedPassword);
    
        //logged in successfully generate session
        if (successResult === true) {
          //sign my jwt
          const payLoad = {
            name: username,
            role: "User"
          };
          const token = jwt.sign(payLoad, JWT_SECRET, {
            algorithm: "HS256"
            // expiresIn: "30"
          });
          const refreshtoken = jwt.sign(payLoad, JWT_REFRESH_SECRET, {
            algorithm: "HS256"
          });
    
          //save the refresh token in the database
          User.updateOne(
            { username: username },
            { $set: { refreshToken: refreshtoken } },
            { strict: false },
            function (err, docs) {
              if (err) {
                console.log(err);
              } else {
                console.log("Updated Docs : ", docs);
              }
            }
          );
          //maybe check if it succeeds..
          // res.setHeader("set-cookie", [
          //   `JWT_TOKEN=${token}; httponly; samesite=lax`
          // ]);
          res.send({
            status: "Success",
            accessToken:token,
            refreshToken: refreshtoken
          });
        } else {
          res.send({ error: "Incorrect username or password" });
        }
      } catch (ex) {
        console.error(ex);
      }
}


export default { registerUser, loginUser }