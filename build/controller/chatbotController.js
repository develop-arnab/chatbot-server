"use strict";
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
var Chatbot_1 = __importDefault(require("../models/Chatbot"));
var authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
var fs_1 = __importDefault(require("fs"));
var JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}";
var JWT_REFRESH_SECRET = "{asdfasdfdsfa-B794-4A04-89DD-15FE7FDBFF78}";
var createChatBot = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, user, chatbot_1, text, filename_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.headers.authorization;
                return [4 /*yield*/, authMiddleware_1.default.validateToken(token, JWT_SECRET)];
            case 1:
                user = _a.sent();
                console.log("USER ", user);
                try {
                    chatbot_1 = req.body.chatbot;
                    chatbot_1.owner_id = user === null || user === void 0 ? void 0 : user.name;
                    chatbot_1.apiKey = (user === null || user === void 0 ? void 0 : user.name) + "1234";
                    text = chatbot_1 === null || chatbot_1 === void 0 ? void 0 : chatbot_1.info;
                    if (!text) {
                        return [2 /*return*/, res.status(400).send('Please provide text in the request body.')];
                    }
                    filename_1 = "".concat(user === null || user === void 0 ? void 0 : user.name, "-outputs.txt");
                    // Write the received text data to the file
                    fs_1.default.writeFile(filename_1, text, function (err) { return __awaiter(void 0, void 0, void 0, function () {
                        var created_bot;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (err) {
                                        console.error(err);
                                        return [2 /*return*/, res.status(500).send('Error while creating the text file.')];
                                    }
                                    console.log("Text file \"".concat(filename_1, "\" has been created."));
                                    chatbot_1.filename = filename_1;
                                    // res.status(200).send(`Text file "${filename}" has been created.`);
                                    chatbot_1.filename = filename_1;
                                    console.log("FILE IS ", chatbot_1);
                                    return [4 /*yield*/, Chatbot_1.default.create(chatbot_1)];
                                case 1:
                                    created_bot = _a.sent();
                                    console.log("CHATTY BOY ", created_bot);
                                    if (created_bot) {
                                        res.send("Created BOT AGAIN");
                                    }
                                    else {
                                        res.send("Created BOT AGAIN");
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                catch (err) {
                    console.log("ERROR IS ", err);
                    res.send("Error ");
                }
                return [2 /*return*/];
        }
    });
}); };
exports.default = { createChatBot: createChatBot };
