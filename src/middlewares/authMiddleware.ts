import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/User";
const JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}";
const JWT_REFRESH_SECRET = "{asdfasdfdsfa-B794-4A04-89DD-15FE7FDBFF78}";
const protected_auth = async (req: Request, res: Response, next: any) => {
  // const token = req.cookies.JWT_TOKEN;
  const token = req.headers.authorization;
  console.log("TOKEN ", token);
  try {
    if (token) {
      //if the cookie is set, query the db
      //get the user and role
      //we are taking a hit everytime a user makes a request
      const user = await validateToken(token, JWT_SECRET);
      //session no longer there, expired etc..
      console.log("user is ", user);
      if (user === null) {
        res.send({
          message: "Invalid Token"
        });
      } else {
        // res.send({
        //   message: "Well Hello There"
        // });
      next();
      }
    } //else ask the user to login
    else {
      res.send({
        message: "Invalid"
      });
    }
  } catch (err: any) {
    return res.sendStatus(500).send({
      message: err.message || "some error occured"
    });
  }
};
const updateToken = async (req: Request, res: Response, next: any) => {
  const token = req.body.refreshToken;
  const user = await validateToken(token, JWT_REFRESH_SECRET);

  if (user === null) {
    res.sendStatus(403);
    return;
  }

  //now that we know the refresh token is valid
  //lets take an extra hit the database
  const result = await User.findOne({ refreshToken: token }).lean();

  if (!result) {
    res.sendStatus(403);
  } else {
    //sign my jwt
    const payLoad = { name: user.name, role: user.role };
    //sign a brand new accesstoken and update the cookie
    const token = jwt.sign(payLoad, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "30s"
    });
    //maybe check if it succeeds..
    res.setHeader("set-cookie", [`JWT_TOKEN=${token}; httponly; samesite=lax`]);
    res.send({
      message: "Refreshed successfully in successfully"
    });
  }
};
async function validateToken(token, secret) {
  try {
    const result = jwt.verify(token, secret);
    console.log("RESULT IS ", result)
    return {
      name: result.name,
      role: result.role
    };
  } catch (ex) {
    return null;
  }
}

export default { protected_auth, updateToken, validateToken };
