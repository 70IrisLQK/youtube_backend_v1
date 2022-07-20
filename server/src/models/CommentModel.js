import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  comment: { type: String },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

const commentModel = model('Comment', commentSchema);

export default commentModel;
