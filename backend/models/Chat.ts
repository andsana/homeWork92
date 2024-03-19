import mongoose, {Schema} from 'mongoose';

const ChatSchema: Schema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  }
});

const Chat =  mongoose.model('Chat', ChatSchema);

export default Chat;