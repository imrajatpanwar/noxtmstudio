import mongoose from 'mongoose';

// Single-document config for the site chatbot widget.
const chatConfigSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    title: { type: String, default: 'Chat with Noxtm' },
    welcome: { type: String, default: "Hi! How can we help with your design project?" },
    fallback: {
      type: String,
      default: "Thanks! Leave your email and we'll get back to you.",
    },
    // rule-based answers: each rule matches if any keyword is in the message
    rules: {
      type: [
        {
          keywords: { type: [String], default: [] },
          answer: { type: String, default: '' },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model('ChatConfig', chatConfigSchema);
