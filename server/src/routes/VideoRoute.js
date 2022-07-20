import { Router } from 'express';
import videoController from '../controllers/VideoController.js';
import { Authenticate } from '../middleware/AuthenticateMiddleware.js';
import { videoUpload } from '../middleware/VideoMiddleware.js';

const videoRouter = Router();

videoRouter.post(
  '/video',
  Authenticate,
  videoUpload.single('video'),
  videoController.uploadVideo
);

videoRouter.put(
  '/video/:videoId',
  Authenticate,
  videoController.updateVideoName
);

videoRouter.delete(
  '/video/:videoId/:videoPath',
  Authenticate,
  videoController.deleteVideo
);

videoRouter.get(
  '/video-like/:videoId/',
  Authenticate,
  videoController.likeVideo
);

videoRouter.get(
  '/video-dislike/:videoId/',
  Authenticate,
  videoController.dislikeVideo
);

videoRouter.get('/video/:filename', Authenticate, videoController.streamVideo);

videoRouter.post('/video-comment', Authenticate, videoController.commentVideo);

videoRouter.post(
  '/video-reply-comment',
  Authenticate,
  videoController.replyComment
);

videoRouter.get(
  '/video-detail/:videoId',
  Authenticate,
  videoController.getVideo
);

videoRouter.get(
  '/video-playlist-create/:name',
  Authenticate,
  videoController.createPlaylist
);

videoRouter.get(
  '/playlist-add/:videoId',
  Authenticate,
  videoController.addToPlaylist
);

export default videoRouter;
