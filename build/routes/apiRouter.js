"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var openAIController_1 = __importDefault(require("../controller/openAIController"));
var router = express_1.default.Router();
router.post('/chatbot', openAIController_1.default.getGPTResponse);
router.post('/chatroom/messages', openAIController_1.default.getChatRoomMessages);
router.get('/chatbot-stream', openAIController_1.default.streamGPTResponse);
router.get('/imagine', openAIController_1.default.getDalleResponse);
// module.exports = router;
exports.default = router;
