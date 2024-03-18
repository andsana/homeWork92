import express from 'express';
import auth from '../middleware/auth';
import Chat from '../models/Chat';
import chat from '../models/Chat';

const chatRouter = express.Router();
chatRouter.get('/latest', auth, async (req, res, next) => {
  try {
    const messages = await Chat.find().sort({createdAt: -1}).limit(30);
    return res.send(messages);
  } catch (error) {
    next(error);
  }
});

chatRouter.post('/', auth, async (req, res, next) => {
  try {
    const message = new Chat({
      username: req.body.username,
      message: req.body.message
    });

    await message.save();
    return res.send({message: 'Message sent!', chat});
  } catch (error) {
    next(error);
  }
});

export default chatRouter;