import { Request, Response } from "express";
import { OpenAI } from "langchain/llms";
import { RetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";
import * as dotenv from "dotenv";
import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "langchain/prompts";
import { ConversationChain } from "langchain/chains";
import axios from "axios";
import { createClient } from "redis"
// import cors from 'cors';
// import { Configuration, OpenAIAPI } from 'openai';
// import http, { IncomingMessage } from 'http';

import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage } from "langchain/schema";
//@ts-ignore
import ChatRoom from '../models/chatRoom.model'
// const ChatRoom = require('../models/ChatRoom.js')

const template = `Assistant named Zeke is a large language model trained by Shell.

Assistant is designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics. As a language model, Assistant is able to generate human-like text based on the input it receives, allowing it to engage in natural-sounding conversations and provide responses that are coherent and relevant to the topic at hand.

Assistant is constantly learning and improving, and its capabilities are constantly evolving. It is able to process and understand large amounts of text, and can use this knowledge to provide accurate and informative responses to a wide range of questions. Additionally, Assistant is able to generate its own text based on the input it receives, allowing it to engage in discussions and provide explanations and descriptions on a wide range of topics.

Overall, Assistant is a powerful tool that can help with a wide range of tasks and provide valuable insights and information on a wide range of topics. Whether you need help with a specific question or just want to have a conversation about a particular topic, Assistant is here to assist.

{history}
Human: {input}
Assistant:`;
dotenv.config();

const getGPTResponse = async (req: Request, res: Response, next: any) => {
  console.log("QUERY S ",req.header('private-key'));
  // const req_token = req.header('authorization')
  // const req_private_key = req.header('private-key')
  // var user_details : any = {}
  // var set_cookie = req.cookies
  // var shortcodes = ['[hub-email]', '[hub-name]' , '[hub-ven_balance]', '[hub-phoneNumber]', '[hub-dateOfBirth]', '[hub-status]', '[hub-mobile]']
  // if(set_cookie.cookieName != 'iset' && req_private_key && req_token) {
  //   try {
  //     var options = {
  //       'method': 'GET',
  //       'url': 'YOUR API ',
  //       'headers': {
  //         'Private-Key': req_private_key,
  //         'Content-Type': 'application/json',
  //         'Authorization' : req_token
  //       }
  //     };
  //     user_details = await axios(options);
  //     // console.log("USER DETAILS : ", user_details.data)
  //     res.cookie('cookieName' , 'iset')
  //     // var set_cookie = req.cookies
  //     // console.log("Cookies ", set_cookie)
  //   } catch (err) {
  //     console.log("User Details Err ", err)
  //   }
  // } 

  // console.log("Redis Value ", value)

  const query_prompt = req.query.message;
  if (query_prompt != undefined) {
    // @ts-ignore
    // if (query_prompt.toString().toLowerCase().includes("hub")) {

    console.log("HIT JOIN");
    try {
      console.log("ROOM ", req.body)
      const { room, messages, user } = req.body;
      console.log("msgs ", messages, "room ", room , "user ", user );
      let query = { room: room };
      let update = {
        $addToSet: {
          doc:"DocumentPath",
          users: [user],
          messages: [messages],
        }
      };
  
      let options = { upsert: true, new: true, setDefaultsOnInsert: true };
      const roomData = await ChatRoom.findOneAndUpdate(
        query,
        update,
        options,
  
        (err : any, roomDataRes : any) => {
          // ... code
          console.log("User Msg Saved to Database : " , roomDataRes);
          // res.send("Holdup");
        }
      );

      const txtFilename = "react-doc";
      const question = query_prompt;
      const txtPath = `./${txtFilename}.txt`;
      const VECTOR_STORE_PATH = `./${txtFilename}.index`;

      const model = new OpenAI({});

      let vectorStore;
      if (fs.existsSync(VECTOR_STORE_PATH)) {
        //If the vector store file exists, load it into memory
        console.log("Vector Exists..");
        vectorStore = await HNSWLib.load(
          VECTOR_STORE_PATH,
          new OpenAIEmbeddings()
        );
      } else {
        const text = fs.readFileSync(txtPath, "utf8");
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000
        });
        const docs = await textSplitter.createDocuments([text]);
        vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
        await vectorStore.save(VECTOR_STORE_PATH);
      }

      const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

      const chain_response = await chain.call({
        query: question
      });

      console.log({ chain_response });


      console.log("msgs ", messages, "room ", room , "user ", user );

      const messageData = {
        room: "Test",
        author: "AI",
        message:chain_response?.text,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes()
      };

      query = { room: room };
      update = {
        $addToSet: {
          doc: "DocumentPath",
          users: ["AI"],
          messages: [messageData],
        }
      };
  
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
      const aiData = await ChatRoom.findOneAndUpdate(
        query,
        update,
        options,
  
        (err : any, roomDataRes : any) => {
          // ... code
          console.log("User Msg Saved to Database : " , roomDataRes);
          // res.send("Holdup");
        }
      );



      res.send({ message: chain_response?.text + "**" });
    } catch (err) {
      console.log("ERR ", err)
    }




      

    //  } 
    // else {
    //   const prompt = new PromptTemplate({
    //       template: template,
    //       inputVariables: ["history", "input"],
    //     });
    //     const model = new OpenAI({ temperature: 0.7 });
    //     const memory = new BufferMemory();
    //     const chain = new ConversationChain({
    //       llm: model,
    //       prompt: prompt,
    //       memory: memory,
    //     });
    //     try {
    //       const chatResp = await chain.call({ input: req.query.message });
    //       console.log("chatResp", chatResp.response);
    //       res.status(200).json({ message: chatResp.response });
    //     } catch (error) {
    //       console.log("chatResp error", error);
    //     }
    // }
  }
};

const getChatRoomMessages =  async(req: Request, res: Response, next: any) => {
  console.log("Get msgs");
  try {
    const { room } = req.body;
    console.log(room, "msgs ");
    let query = { room: room };

    const roomData = await ChatRoom.findOne(
      query,
      (err, roomDataRes) => {
        // ... code
        console.log("room msgs " , roomDataRes);
        res.send(roomDataRes);
      }
    );
  } catch (err) {}
}

const streamGPTResponse = async (req: Request, res: Response, next: any) => {
  console.log("QUERY S ", typeof req.query.message);
  const query_prompt = req.query.message;
  if (query_prompt != undefined) {
    // @ts-ignore
    if (query_prompt?.includes("Hub")) {
      const txtFilename = "HubCultureAbout";
      const question = query_prompt;
      const txtPath = `./${txtFilename}.txt`;
      const VECTOR_STORE_PATH = `../../${txtFilename}.index`;

      const model = new OpenAI({});

      let vectorStore;
      if (fs.existsSync(VECTOR_STORE_PATH)) {
        //If the vector store file exists, load it into memory
        console.log("Vector Exists..");
        vectorStore = await HNSWLib.load(
          VECTOR_STORE_PATH,
          new OpenAIEmbeddings()
        );
      } else {
        const text = fs.readFileSync(txtPath, "utf8");
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000
        });
        const docs = await textSplitter.createDocuments([text]);
        vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
        await vectorStore.save(VECTOR_STORE_PATH);
      }

      const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

      const chain_response = await chain.call({
        query: question
      });

      console.log({ chain_response });
      res.send({ message: chain_response?.text });
    } else {
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Content-Encoding", "none");
      res.flushHeaders(); // flush the headers to establish SSE with client

      const chat = new ChatOpenAI({
        streaming: true,
        callbacks: [
          {
            handleLLMNewToken(token: string) {
              process.stdout.write(token);

              res.write(token);
            }
          }
        ]
      });

      await chat.call([
        // @ts-ignore
        new HumanChatMessage(query_prompt)
      ]);
      res.end();
      res.on("close", () => {
        console.log("client dropped me");
        res.end();
      });
    }
  }
};



const getDalleResponse = (req: Request, res: Response, next: any) => {
  res.send("Inside Dall e controller");
};
export default {
  getGPTResponse,
  streamGPTResponse,
  getDalleResponse,
  getChatRoomMessages
};
