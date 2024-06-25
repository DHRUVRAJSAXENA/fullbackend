import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { populate } from "dotenv";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video not fetched to like");
  }

  const existedLiked = await Like.findOne({ video: videoId, likedBy: userId });

  if (existedLiked) {
    await existedLiked.deleteOne();

    return res.status(200).json(new ApiResponse(200, null, "Video disliked"));
  }

  const newLike = new Like({
    video: videoId,
    likedBy: userId,
  });

  await newLike.save();

  return res
    .status(200)
    .json(new ApiResponse(200, newLike, "Liked this video"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(400, "Comment not fetched");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });

  if (existingLike) {
    await existingLike.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, Like, "Comment Unliked succesfully"));
  }

  const newLike = new Like({
    comment: commentId,
    likedBy: userId,
  });

  await newLike.save();

  return res
    .status(200)
    .json(new ApiResponse(200, newLike, "Comment liked Succesfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(400, "Not able to fetch Tweet");
  }

  const existedLiked = await Like.findOne({ tweet: tweetId, likedBy: userId });

  if (existedLiked) {
    await existedLiked.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Unliked the tweet"));
  }

  const newLike = new Like({
    tweet: tweetId,
    likedBy: userId,
  });

  newLike.save();

  return res
    .status(200)
    .json(new ApiResponse(200, newLike, "Tweet succesfully liked"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const likedVideo = await Like.findOne({
    likedBy: userId,
    video: { $exists: true },
  })
    .populate({
      path: "video",
      populate: {
        path: "owner",
        select: "fullName username avatar",
      },
    })
    .select("video");

  if (!likedVideo || likedVideo.length === 0) {
    throw new ApiError(400, "LikedVideos not fetched");
  }

  // extract the videos from likeVideo
  const videos = likedVideo.map((like) => like.video);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "liked video fetched"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
