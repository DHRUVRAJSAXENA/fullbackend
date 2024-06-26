import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const { channelId } = req.user._id

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID")
  }

  //   Total videos
  const totalVideos = await Video.countDocuments({ owner: channelId })

  //   total video views
  const totalViews = await Video.aggregate([
    { $match: { owner: mongoose.Types.ObjectId(channelId) } },
    { $group: { _id: null, totalViews: { $sum: "$views" } } },
  ])
  const totalCountViews = totalViews.length ? totalViews[0].totalViews : 0

  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
  })

  // Total likes
  const totalLikes = await Like.countDocuments({ channel: channelId })

  const stats = {
    totalVideos,
    totalViews: totalViewsCount,
    totalSubscribers,
    totalLikes,
  }

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Channel stats fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
})

export { getChannelStats, getChannelVideos }
