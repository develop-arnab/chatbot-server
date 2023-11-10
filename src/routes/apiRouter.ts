import express, {Request, Response} from "express";
import openAIController from "../controller/openAIController";
import userController from "../controller/userController";
import chatbotController from "../controller/chatbotController";
import authMiddleware from '../middlewares/authMiddleware'
var router = express.Router();
router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)

router.post('/create-chatbot', authMiddleware.protected_auth, chatbotController.createChatBot);


router.post('/chatbot', openAIController.getGPTResponse);
router.post('/chatroom/messages', openAIController.getChatRoomMessages);
router.get('/chatbot-info', openAIController.getChatbotInfo);
router.get('/chatbot-stream', openAIController.streamGPTResponse);
router.get('/imagine', openAIController.getDalleResponse);

// module.exports = router;
export default router;