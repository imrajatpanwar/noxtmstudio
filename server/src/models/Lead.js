import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    message: { type: String, default: '' },
    source: { type: String, default: 'contact-form' }, // contact-form | chatbot
    status: { type: String, enum: ['new', 'contacted', 'won', 'lost'], default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.model('Lead', leadSchema);
