import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  folderId: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  path: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    default: 'javascript'
  },
  sourceCode: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 0
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

fileSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const File = mongoose.models.File || mongoose.model('File', fileSchema);
export default File;
