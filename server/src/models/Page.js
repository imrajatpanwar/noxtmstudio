import mongoose from 'mongoose';

// Generic CMS page: a slug + a flexible block list the front-end renders.
const pageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    // sections is an array of arbitrary key/value blocks (hero, stats, etc.)
    sections: { type: mongoose.Schema.Types.Mixed, default: {} },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Page', pageSchema);
