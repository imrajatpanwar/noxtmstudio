import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: '' },
    bio: { type: String, default: '' },
    photo: { type: String, default: '' },
    socials: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      dribbble: { type: String, default: '' },
    },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('TeamMember', teamMemberSchema);
