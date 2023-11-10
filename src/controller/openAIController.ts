import { Request, Response } from "express";
import { OpenAI } from "langchain/llms";
import { RetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";
import * as dotenv from "dotenv";
import authMiddleware from '../middlewares/authMiddleware'
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage } from "langchain/schema";
//@ts-ignore
import ChatRoom from '../models/chatRoom.model'
import Chatbot from "../models/Chatbot";
const JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}";
const JWT_REFRESH_SECRET = "{asdfasdfdsfa-B794-4A04-89DD-15FE7FDBFF78}";
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

  const query_prompt = req.query.message;
  if (query_prompt != undefined) {
    // @ts-ignore
    // if (query_prompt.toString().toLowerCase().includes("hub")) {

    console.log("HIT JOIN");
    try {
      console.log("ROOM ", req.body)
      const { room, messages, user, apiKey } = req.body;
      console.log("msgs ", messages, "room ", room , "user ", user );
      let query = { room: room };
      let update = {
        $addToSet: {
          users: [user],
          messages: [messages],
        }
      };
  
      let options = { upsert: true, new: true};
      const roomData = await ChatRoom.findOneAndUpdate(
        query,
        update,
        options,
  
        (err : any, roomDataRes : any) => {
          // ... code
          console.log("User Msg Saved to Database : " , roomDataRes);
          // res.send("Holdup");
          console.log("ERROR MONGOSSS ", err)
        }
      );

      const chatbot = await Chatbot.findOne({apiKey: apiKey})
      console.log("CHAT BOT", chatbot)

      // const txtFilename = "zerodha-outputs.txt";
      const txtFilename = `${chatbot.filename}`;
      const question = query_prompt;
      const txtPath = `./${txtFilename}`;
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
        try {
        const text = fs.readFileSync(txtPath, "utf8");
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000
        });
        const docs = await textSplitter.createDocuments([text]);
        vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
        await vectorStore.save(VECTOR_STORE_PATH);
        } catch(err) {
          console.log("OPEN AI ERR ", err)
        }

      }

      const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

      const chain_response = await chain.call({
        query: question
      });

      // console.log({ chain_response });


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
          users: ["AI"],
          messages: [messageData],
        }
      };
  
      options = { upsert: true, new: true };
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
    const { apiKey } = req.body;
    // console.log(room, "msgs ");
    const chatbot = await Chatbot.findOne({apiKey: apiKey})
    console.log("CHAT BOT", chatbot)
    let query = { room: chatbot?.room };

    const roomData = await ChatRoom.findOne(
      query,
      (err, chats) => {
        // ... code
        console.log("room msgs " , chats);
        res.send({chats, "room": chatbot?.room});
      }
    );
  } catch (err) {}
}

const getChatbotInfo =  async(req: Request, res: Response, next: any) => {
  const token = req.header('authorization');
  const user = await authMiddleware.validateToken(token, JWT_SECRET);
  console.log("Get msgs", user);

  try {
    // const { apiKey } = req.body;
    // console.log(room, "msgs ");
    const chatbot = await Chatbot.findOne({owner_id: user?.name})
    console.log("CHAT BOT", chatbot)
     res.send({"Chatbot" : chatbot})

    // let query = { room: chatbot?.room };

    // const chatbot_info = await ChatRoom.findOne(
    //   query,
    //   (err, chats) => {
    //     // ... code
    //     console.log("room msgs " , chats);
    //     res.send({chats, "room": chatbot?.room});
    //   }
    // );
  } catch (err) {
 res.send({"Error" : err})

  }
}

const streamGPTResponse = async (req: Request, res: Response, next: any) => {
  console.log("QUERY S ", typeof req.query.message);
  const query_prompt = req.query.message;
  if (query_prompt != undefined) {
    // @ts-ignore
    if (query_prompt?.includes("Hub")) {
      const txtFilename = "react-doc";
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
  getChatRoomMessages,
  getChatbotInfo
};
