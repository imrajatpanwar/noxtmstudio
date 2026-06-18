import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    from: { type: String, enum: ['user', 'bot'], required: true },
    text: { type: String, required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    visitorId: { type: String, required: true },
    contactEmail: { type: String, default: '' },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('Conversation', conversationSchema);
