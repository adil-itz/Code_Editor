import mongoose from 'mongoose';

const savedSnippetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'Untitled Snippet'
  },
  language: {
    type: String,
    required: true,
    default: 'javascript'
  },
  code: {
    type: String,
    required: true,
    default: ''
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

savedSnippetSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const SavedSnippet = mongoose.models.SavedSnippet || mongoose.model('SavedSnippet', savedSnippetSchema);
export default SavedSnippet;
