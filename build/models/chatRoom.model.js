"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
// const { Schema } = mongoose;
var ChatRoomSchema = new mongoose_1.default.Schema({
    room: { type: String, required: true },
    users: { type: Array, required: false },
    messages: { type: Array, required: false },
}, { collection: 'chatroom' });
var ChatRoom = mongoose_1.default.model('ChatRoom', ChatRoomSchema);
exports.default = ChatRoom;
