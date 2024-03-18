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

export default mongoose.model('Message', ChatSchema);