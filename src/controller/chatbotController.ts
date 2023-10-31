import { Request, Response } from "express";
import Chatbot from "../models/Chatbot";
import authMiddleware from '../middlewares/authMiddleware'
import fs from 'fs'
const JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}";
const JWT_REFRESH_SECRET = "{asdfasdfdsfa-B794-4A04-89DD-15FE7FDBFF78}";
const createChatBot = async (req: Request, res: Response, next: any) => {
    const token = req.headers.authorization;
    const user = await authMiddleware.validateToken(token, JWT_SECRET);

    console.log("USER ", user)
    try {
        const { chatbot } = req.body;
        chatbot.owner_id = user?.name;
        chatbot.apiKey = user?.name + "1234";
          const text = chatbot?.info;

          if (!text) {
            return res.status(400).send('Please provide text in the request body.');
          }
        
          // Generate a unique filename or use a specific filename as needed
          const filename = `${user?.name}-outputs.txt`;
        
          // Write the received text data to the file
          fs.writeFile(filename, text, async (err) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Error while creating the text file.');
            }
        
            console.log(`Text file "${filename}" has been created.`);
            chatbot.filename = filename
            // res.status(200).send(`Text file "${filename}" has been created.`);
            chatbot.filename = filename
            console.log("FILE IS ", chatbot)
            const created_bot = await Chatbot.create(
              chatbot
            );
            console.log("CHATTY BOY ", created_bot)
            if(created_bot){
              res.send("Created BOT AGAIN")
            }
            else {
              res.send("Created BOT AGAIN")
            }
          
          });

    } catch(err) {
        console.log("ERROR IS ", err)
        res.send("Error ")
    }

}

export default { createChatBot }