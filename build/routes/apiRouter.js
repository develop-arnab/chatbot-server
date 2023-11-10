"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var openAIController_1 = __importDefault(require("../controller/openAIController"));
var userController_1 = __importDefault(require("../controller/userController"));
var chatbotController_1 = __importDefault(require("../controller/chatbotController"));
var authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
var router = express_1.default.Router();
router.post('/register', userController_1.default.registerUser);
router.post('/login', userController_1.default.loginUser);
router.post('/create-chatbot', authMiddleware_1.default.protected_auth, chatbotController_1.default.createChatBot);
router.post('/chatbot', openAIController_1.default.getGPTResponse);
router.post('/chatroom/messages', openAIController_1.default.getChatRoomMessages);
router.get('/chatbot-info', openAIController_1.default.getChatbotInfo);
router.get('/chatbot-stream', openAIController_1.default.streamGPTResponse);
router.get('/imagine', openAIController_1.default.getDalleResponse);
// module.exports = router;
exports.default = router;
