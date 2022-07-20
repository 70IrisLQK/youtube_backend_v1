import { Schema, model } from 'mongoose';

const playlistSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  videos: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Video',
    },
  ],
  playlistName: {
    type: String,
  },
});

const playlistModel = model('playlist', playlistSchema);

export default playlistModel;
