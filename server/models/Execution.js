import mongoose from 'mongoose';

const executionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  file: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  language: {
    type: String,
    required: true
  },
  judge0LanguageId: {
    type: Number,
    required: true
  },
  stdin: {
    type: String,
    default: ''
  },
  stdout: {
    type: String,
    default: null
  },
  stderr: {
    type: String,
    default: null
  },
  compileOutput: {
    type: String,
    default: null
  },
  status: {
    type: String,
    default: 'Executed'
  },
  time: {
    type: String,
    default: '0.00'
  },
  memory: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

executionSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Execution = mongoose.models.Execution || mongoose.model('Execution', executionSchema);
export default Execution;
