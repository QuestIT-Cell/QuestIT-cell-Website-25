import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: '',
  },
  github: {
    type: String,
    default: '',
  },
  linkedin: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    required: true,
  },
}, { _id: false });

const SubGroupSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  members: [MemberSchema],
}, { _id: false });

const TeamGroupSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  members: [MemberSchema],
  subGroups: [SubGroupSchema],
}, { timestamps: true });

export default mongoose.models.TeamGroup || mongoose.model('TeamGroup', TeamGroupSchema);
