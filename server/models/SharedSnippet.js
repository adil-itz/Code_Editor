import mongoose from 'mongoose';

const sharedSnippetSchema = new mongoose.Schema({
  shareId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    default: 'Shared Code'
  },
  language: {
    type: String,
    default: 'javascript'
  },
  code: {
    type: String,
    default: ''
  },
  files: [
    {
      name: String,
      path: String,
      language: String,
      sourceCode: String
    }
  ],
  template: {
    type: String,
    default: 'empty'
  },
  authorName: {
    type: String,
    default: 'Anonymous'
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

sharedSnippetSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const SharedSnippet = mongoose.models.SharedSnippet || mongoose.model('SharedSnippet', sharedSnippetSchema);
export default SharedSnippet;
