"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var llms_1 = require("langchain/llms");
var chains_1 = require("langchain/chains");
var vectorstores_1 = require("langchain/vectorstores");
var embeddings_1 = require("langchain/embeddings");
var text_splitter_1 = require("langchain/text_splitter");
var fs = __importStar(require("fs"));
var dotenv = __importStar(require("dotenv"));
var openai_1 = require("langchain/chat_models/openai");
var schema_1 = require("langchain/schema");
//@ts-ignore
var chatRoom_model_1 = __importDefault(require("../models/chatRoom.model"));
var Chatbot_1 = __importDefault(require("../models/Chatbot"));
var template = "Assistant named Zeke is a large language model trained by Shell.\n\nAssistant is designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics. As a language model, Assistant is able to generate human-like text based on the input it receives, allowing it to engage in natural-sounding conversations and provide responses that are coherent and relevant to the topic at hand.\n\nAssistant is constantly learning and improving, and its capabilities are constantly evolving. It is able to process and understand large amounts of text, and can use this knowledge to provide accurate and informative responses to a wide range of questions. Additionally, Assistant is able to generate its own text based on the input it receives, allowing it to engage in discussions and provide explanations and descriptions on a wide range of topics.\n\nOverall, Assistant is a powerful tool that can help with a wide range of tasks and provide valuable insights and information on a wide range of topics. Whether you need help with a specific question or just want to have a conversation about a particular topic, Assistant is here to assist.\n\n{history}\nHuman: {input}\nAssistant:";
dotenv.config();
var getGPTResponse = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var query_prompt, _a, room, messages, user, apiKey, query, update, options, roomData, chatbot, txtFilename, question, txtPath, VECTOR_STORE_PATH, model, vectorStore, text, textSplitter, docs, err_1, chain, chain_response, messageData, aiData, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("QUERY S ", req.header('private-key'));
                query_prompt = req.query.message;
                if (!(query_prompt != undefined)) return [3 /*break*/, 14];
                // @ts-ignore
                // if (query_prompt.toString().toLowerCase().includes("hub")) {
                console.log("HIT JOIN");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 13, , 14]);
                console.log("ROOM ", req.body);
                _a = req.body, room = _a.room, messages = _a.messages, user = _a.user, apiKey = _a.apiKey;
                console.log("msgs ", messages, "room ", room, "user ", user);
                query = { room: room };
                update = {
                    $addToSet: {
                        users: [user],
                        messages: [messages],
                    }
                };
                options = { upsert: true, new: true };
                return [4 /*yield*/, chatRoom_model_1.default.findOneAndUpdate(query, update, options, function (err, roomDataRes) {
                        // ... code
                        console.log("User Msg Saved to Database : ", roomDataRes);
                        // res.send("Holdup");
                        console.log("ERROR MONGOSSS ", err);
                    })];
            case 2:
                roomData = _b.sent();
                return [4 /*yield*/, Chatbot_1.default.findOne({ apiKey: apiKey })];
            case 3:
                chatbot = _b.sent();
                console.log("CHAT BOT", chatbot);
                txtFilename = "".concat(chatbot.filename);
                question = query_prompt;
                txtPath = "./".concat(txtFilename);
                VECTOR_STORE_PATH = "./".concat(txtFilename, ".index");
                model = new llms_1.OpenAI({});
                vectorStore = void 0;
                if (!fs.existsSync(VECTOR_STORE_PATH)) return [3 /*break*/, 5];
                //If the vector store file exists, load it into memory
                console.log("Vector Exists..");
                return [4 /*yield*/, vectorstores_1.HNSWLib.load(VECTOR_STORE_PATH, new embeddings_1.OpenAIEmbeddings())];
            case 4:
                vectorStore = _b.sent();
                return [3 /*break*/, 10];
            case 5:
                _b.trys.push([5, 9, , 10]);
                text = fs.readFileSync(txtPath, "utf8");
                textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
                    chunkSize: 1000
                });
                return [4 /*yield*/, textSplitter.createDocuments([text])];
            case 6:
                docs = _b.sent();
                return [4 /*yield*/, vectorstores_1.HNSWLib.fromDocuments(docs, new embeddings_1.OpenAIEmbeddings())];
            case 7:
                vectorStore = _b.sent();
                return [4 /*yield*/, vectorStore.save(VECTOR_STORE_PATH)];
            case 8:
                _b.sent();
                return [3 /*break*/, 10];
            case 9:
                err_1 = _b.sent();
                console.log("OPEN AI ERR ", err_1);
                return [3 /*break*/, 10];
            case 10:
                chain = chains_1.RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
                return [4 /*yield*/, chain.call({
                        query: question
                    })];
            case 11:
                chain_response = _b.sent();
                // console.log({ chain_response });
                console.log("msgs ", messages, "room ", room, "user ", user);
                messageData = {
                    room: "Test",
                    author: "AI",
                    message: chain_response === null || chain_response === void 0 ? void 0 : chain_response.text,
                    time: new Date(Date.now()).getHours() +
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
                return [4 /*yield*/, chatRoom_model_1.default.findOneAndUpdate(query, update, options, function (err, roomDataRes) {
                        // ... code
                        console.log("User Msg Saved to Database : ", roomDataRes);
                        // res.send("Holdup");
                    })];
            case 12:
                aiData = _b.sent();
                res.send({ message: (chain_response === null || chain_response === void 0 ? void 0 : chain_response.text) + "**" });
                return [3 /*break*/, 14];
            case 13:
                err_2 = _b.sent();
                console.log("ERR ", err_2);
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); };
var getChatRoomMessages = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var apiKey, chatbot_1, query, roomData, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Get msgs");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                apiKey = req.body.apiKey;
                return [4 /*yield*/, Chatbot_1.default.findOne({ apiKey: apiKey })];
            case 2:
                chatbot_1 = _a.sent();
                console.log("CHAT BOT", chatbot_1);
                query = { room: chatbot_1 === null || chatbot_1 === void 0 ? void 0 : chatbot_1.room };
                return [4 /*yield*/, chatRoom_model_1.default.findOne(query, function (err, chats) {
                        // ... code
                        console.log("room msgs ", chats);
                        res.send({ chats: chats, "room": chatbot_1 === null || chatbot_1 === void 0 ? void 0 : chatbot_1.room });
                    })];
            case 3:
                roomData = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var streamGPTResponse = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var query_prompt, txtFilename, question, txtPath, VECTOR_STORE_PATH, model, vectorStore, text, textSplitter, docs, chain, chain_response, chat;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("QUERY S ", typeof req.query.message);
                query_prompt = req.query.message;
                if (!(query_prompt != undefined)) return [3 /*break*/, 10];
                if (!(query_prompt === null || query_prompt === void 0 ? void 0 : query_prompt.includes("Hub"))) return [3 /*break*/, 8];
                txtFilename = "react-doc";
                question = query_prompt;
                txtPath = "./".concat(txtFilename, ".txt");
                VECTOR_STORE_PATH = "../../".concat(txtFilename, ".index");
                model = new llms_1.OpenAI({});
                vectorStore = void 0;
                if (!fs.existsSync(VECTOR_STORE_PATH)) return [3 /*break*/, 2];
                //If the vector store file exists, load it into memory
                console.log("Vector Exists..");
                return [4 /*yield*/, vectorstores_1.HNSWLib.load(VECTOR_STORE_PATH, new embeddings_1.OpenAIEmbeddings())];
            case 1:
                vectorStore = _a.sent();
                return [3 /*break*/, 6];
            case 2:
                text = fs.readFileSync(txtPath, "utf8");
                textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
                    chunkSize: 1000
                });
                return [4 /*yield*/, textSplitter.createDocuments([text])];
            case 3:
                docs = _a.sent();
                return [4 /*yield*/, vectorstores_1.HNSWLib.fromDocuments(docs, new embeddings_1.OpenAIEmbeddings())];
            case 4:
                vectorStore = _a.sent();
                return [4 /*yield*/, vectorStore.save(VECTOR_STORE_PATH)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                chain = chains_1.RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
                return [4 /*yield*/, chain.call({
                        query: question
                    })];
            case 7:
                chain_response = _a.sent();
                console.log({ chain_response: chain_response });
                res.send({ message: chain_response === null || chain_response === void 0 ? void 0 : chain_response.text });
                return [3 /*break*/, 10];
            case 8:
                res.setHeader("Cache-Control", "no-cache");
                res.setHeader("Content-Type", "text/event-stream");
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Connection", "keep-alive");
                res.setHeader("Content-Encoding", "none");
                res.flushHeaders(); // flush the headers to establish SSE with client
                chat = new openai_1.ChatOpenAI({
                    streaming: true,
                    callbacks: [
                        {
                            handleLLMNewToken: function (token) {
                                process.stdout.write(token);
                                res.write(token);
                            }
                        }
                    ]
                });
                return [4 /*yield*/, chat.call([
                        // @ts-ignore
                        new schema_1.HumanChatMessage(query_prompt)
                    ])];
            case 9:
                _a.sent();
                res.end();
                res.on("close", function () {
                    console.log("client dropped me");
                    res.end();
                });
                _a.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); };
var getDalleResponse = function (req, res, next) {
    res.send("Inside Dall e controller");
};
exports.default = {
    getGPTResponse: getGPTResponse,
    streamGPTResponse: streamGPTResponse,
    getDalleResponse: getDalleResponse,
    getChatRoomMessages: getChatRoomMessages
};
