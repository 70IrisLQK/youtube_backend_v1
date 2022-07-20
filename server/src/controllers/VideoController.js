import videoModel from '../models/VideoModel';
import fs from 'fs';
import commentModel from '../models/CommentModel';
import { IncomingForm } from 'formidable';
import playlistModel from '../models/PlaylistModel';

const videoController = {
  uploadVideo: async (req, res) => {
    try {
      const newVideo = new videoModel({
        owner: req.token._id,
        name: req.body.name,
        videoPath: req.filename,
      });

      const savedVideo = await newVideo.save();

      return res
        .status(201)
        .json({ msg: 'Video upload successfully', video: savedVideo });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  streamVideo: async (req, res) => {
    try {
      const range = req.headers.range;
      if (!range) {
        return res
          .status(400)
          .json({ msg: 'Range header is required to start to stream' });
      }

      const videoPath = `videos/${req.params.filename}`;
      const videoSize = fs.statSync(videoPath).size;

      const start = Number(range.replace(/\D/g, ''));
      const chunkSize = 10 * 6; //1mb
      const end = Math.min(start + chunkSize, videoSize - 1);

      const contentLength = end - start + 1;
      const headers = {
        'Content-length': contentLength,
        'Accept-Range': 'bytes',
        'Content-Type': 'video/mp4',
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      };
      res.writeHead(206, headers);
      const videoStream = fs.createReadStream(videoPath, { start, end });
      videoStream.pipe(res);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateVideoName: async (req, res) => {
    const name = req.body.name;
    const { videoId } = req.params;

    try {
      await videoModel.findOneAndUpdate(
        { _id: videoId },
        { $set: { name: name } }
      );
      return res.status(200).json({ msg: 'Video name updated successfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteVideo: async (req, res) => {
    const { videoId, videoPath } = req.params;

    try {
      const videoPathServer = `videos/${videoPath}`;
      if (fs.existsSync(videoPathServer)) {
        fs.unlink(videoPathServer, (error) => {
          if (error) {
            return res
              .status(500)
              .json({ msg: 'Network Error. Please try again.' });
          }
        });
        await videoModel.findByIdAndDelete({ _id: videoId });
        return res.status(200).json({ msg: 'Video deleted successfully.' });
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  likeVideo: async (req, res) => {
    const { videoId } = req.params;
    try {
      await videoModel.findByIdAndUpdate(
        { _id: videoId },
        { $inc: { likes: 1 } },
        { new: true }
      );
      return res.status(200).json({ msg: 'Video liked' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  dislikeVideo: async (req, res) => {
    const { videoId } = req.params;
    try {
      await videoModel.findByIdAndUpdate(
        { _id: videoId },
        { $inc: { likes: -1 } },
        { new: true }
      );
      return res.status(200).json({ msg: 'Video disliked' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  commentVideo: async (req, res) => {
    const token = req.token;
    try {
      const form = new IncomingForm();
      form.parse(req, async (error, fields, files) => {
        if (error) {
          return res.status(500).json({
            msg: 'Network Error: Failed to login account, please try again later',
          });
        }
        const { comment, videoId } = fields;
        if (!comment || !videoId) {
          return res
            .status(400)
            .json({ msg: 'All filed are required to comment' });
        }

        const newComment = new commentModel({ owner: token._id, comment });

        const savedComment = await newComment.save();

        await videoModel.findOneAndUpdate(
          { _id: videoId },
          { $push: { comments: savedComment._id } }
        );

        return res.status(201).json({ msg: 'Comment video successfully' });
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  replyComment: async (req, res) => {
    try {
      const token = req.token;
      const form = new IncomingForm();
      form.parse(req, async (error, fields, files) => {
        if (error) {
          return res.status(500).json({
            msg: 'Network Error: Failed to login account, please try again later',
          });
        }
        const { comment, commentId } = fields;

        if (!comment || !commentId) {
          return res
            .status(400)
            .json({ msg: 'All filed are required to comment' });
        }

        const newComment = new commentModel({
          owner: token._id,
          comment,
        });
        const savedComment = await newComment.save();

        await commentModel.findByIdAndUpdate(
          { _id: comment._id },
          { $push: { replies: savedComment._id } },
          { new: true }
        );

        return res.status(201).json({ msg: 'Reply comment successfully.' });
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getVideo: async (req, res) => {
    try {
      const { videoId } = req.params;

      const video = await videoModel.findOne({ _id: videoId }).populate({
        path: 'comments',
        populate: {
          path: 'replies',
          model: 'Comment',
        },
      });
      return res.status(200).json(video);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createPlaylist: async (req, res) => {
    const token = req.token;
    const { name } = req.params;
    try {
      const newPlaylist = new playlistModel({
        owner: token._id,
        playlistName: name,
      });
      await newPlaylist.save();

      return res.status(500).json({ msg: 'Playlist has been created' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  addToPlaylist: async (req, res) => {
    const token = req.token;
    const { video } = req.params;

    try {
      await playlistModel.findOneAndUpdate(
        { owner: token._id },
        { $push: { videos: video } },
        { new: true }
      );

      return res.status(201).json({ msg: 'Add to playlist successfully' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

export default videoController;
