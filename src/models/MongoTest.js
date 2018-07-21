import mongoose from 'mongoose';

const TestSchema = mongoose.Schema({
  name: { type: String, required: true, index: true },
  email: { type: String, lowercase: true, required: true }
});

export default mongoose.model('Test', TestSchema);
