import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    url: { type: String, default: '' },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
