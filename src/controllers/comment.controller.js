import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

Comment.schema.plugin(mongooseAggregatePaginate);

const getVideoComments = asyncHandler(async (req, res) => {
  // takeing the videoId from url and then taking the pages and how many comments we want at a time
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // here the pages and limit are in string format so we are converting it into number
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
  };

  const pipeline = [
    {
      $match: {
        video: mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerInfo",
      },
    },
    { $unwind: "$ownerInfo" },
    {
      $project: {
        _id: 1,
        content: 1,
        createdAt: 1,
        owner: "$ownerInfo",
      },
    },
  ];

  const comments = Comment.aggregatePaginate(pipeline, options);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched succesfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not available in DataBase");
  }

  const newComment = new Comment({
    content,
    video: videoId,
    owner: userId,
  });

  await newComment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, newComment, "New comment added"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  // find the comment in DB
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(400, "Comment not found");
  }

  // check if the person who is trying to update the code is the owner of that code
  if (comment.owner.toString() !== userId.toString()) {
    throw new ApiError(400, "You are not the owner of this comment");
  }

  // update the comment using new comment
  comment.content = content;
  await comment.save();

  return res.status(200).json(200, comment, "Comment Updated Successfully");
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.user._id;

  const comment = Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(400, "Comment not found");
  }

  if (comment.owner.toString() !== userId.toString()) {
    throw new ApiError(400, "You are not authorized to delete this comment");
  }

  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted Succesfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
