import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  template: {
    type: String,
    enum: ['empty', 'html-css-js', 'react', 'node', 'python', 'typescript', 'kotlin', 'swift'],
    default: 'empty'
  },
  defaultLanguage: {
    type: String,
    default: 'javascript'
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  lastOpenedAt: {
    type: Date,
    default: Date.now
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

projectSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;
