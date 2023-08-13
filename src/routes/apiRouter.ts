import express, {Request, Response} from "express";
import openAIController from "../controller/openAIController";
var router = express.Router();

router.post('/chatbot', openAIController.getGPTResponse);
router.post('/chatroom/messages', openAIController.getChatRoomMessages);
router.get('/chatbot-stream', openAIController.streamGPTResponse);
router.get('/imagine', openAIController.getDalleResponse);

// module.exports = router;
export default router;