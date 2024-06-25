import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
  //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body
  const { videofile, thumbnamil } = req.files

  if (!videofile || !thumbnamil) {
    throw new ApiError(400, "VideoFile and thumbnail required")
  }

  const videourl = await uploadOnCloudinary(videofile[0].path)
  const thumbnailurl = await uploadOnCloudinary(videofile[0].path)

  if (!videourl || !thumbnailurl) {
    throw new ApiError(400, "Video and thumbnail not uploaded")
  }

  const newVideo = new Video({
    videofile: videoFileUrl,
    thumbnail: thumbnailUrl,
    title,
    description,
    duration: 0, // Set duration to a default value or calculate it if possible
    owner: req.user._id,
  })

  await newVideo.save()

  return res
    .status(200)
    .json(new ApiResponse(200, newVideo, "Video uploaded succesfully"))
})

const getVideoById = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Wrong Video ID")
  }

  const video = await Video.findById(videoId)

  if (!video) {
    throw new ApiError(400, "Video not found")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched Successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  //TODO: update video details like title, description, thumbnail
  const { title, description } = req.body
  const { thumbnail } = req.file
  const userId = req.user._id

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Video id is wrong")
  }

  const video = await Video.findById(videoId)

  if (!video) {
    throw new ApiError(404, "Video not fetched")
  }

  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to make changes in this video"
    )
  }

  let thumbnailUrl
  if (thumbnail) {
    thumbnailUrl = await uploadOnCloudinary(thumbnail)
  }
  const updatedFields = {}
  if (title) updatedFields.title = title
  if (description) updatedFields.description = description
  if (thumbnailUrl) updatedFields.thumbnail = thumbnailUrl

  const newVideo = await Video.findByIdAndUpdate(videoId, updatedFields, {
    new: true,
  })

  return res
    .status(200)
    .json(new ApiResponse(200, newVideo, "Video updated Succesfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  const userId = req.user._id

  if (!userId || !videoId) {
    throw new ApiError(400, "Id's not found")
  }

  const video = await Video.findOne({ _id: videoId, owner: userId })

  if (!video) {
    throw new ApiError(400, "video not found")
  }

  //   if (video.owner.toString() !== userId.toString()) {
  //     throw new ApiError(400, "You are not authorized to delete this Video")
  //   }

  await Video.deleteOne({ _id: userId })

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted Succesfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  const userId = req.user._id

  const video = await Video.findOne({ _id: videoId, owner: userId })

  if (!video) {
    throw new ApiError(404, "Video not found")
  }

  video.isPublished = !video.isPublished

  await video.save()

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video toggled Successfully"))
})

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
}
