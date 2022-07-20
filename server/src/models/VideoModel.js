import { Schema, model } from 'mongoose';

const videoSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    require: [true, 'Video name is required to upload video'],
  },
  videoPath: {
    type: String,
    require: [true, 'Video path is required to upload video'],
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Array,
    default: [],
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

const videoModel = model('Video', videoSchema);

export default videoModel;
