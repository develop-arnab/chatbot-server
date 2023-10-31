import mongoose from 'mongoose';
// const { Schema } = mongoose;
const ChatRoomSchema = new mongoose.Schema(
	{
		room: { type: String, required: true},
        users: { type: Array, required: false },
        messages: { type: Array, required: false },
	},
	{ collection: 'chatroom' }
)
const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema)
export default ChatRoom ;