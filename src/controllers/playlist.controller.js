import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body
  const userId = req.user._id

  if (!name || !description || !userId) {
    throw new ApiError(404, "Something is missing")
  }

  const newPlaylist = new Playlist({
    title: name,
    description: description,
  })

  if (!newPlaylist) {
    throw new ApiError(400, "Playlist not created")
  }

  await newPlaylist.save()

  return res
    .status(200)
    .json(new ApiResponse(200, newPlaylist, "Playlist is created"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params
  //TODO: get user playlists

  if (!userId) {
    throw new ApiError(400, "Invalid UserId")
  }

  const playlist = await Playlist.find({ owner: userId })

  if (!playlist) {
    throw new ApiError(400, "playlist not found")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist found using user id"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params
  //TODO: get playlist by id

  if (!playlistId) {
    throw new ApiError(400, "Invalid playlistId")
  }

  const playlist = await Playlist.findById(playlistId).populate("video")

  if (!playlist) {
    throw new ApiError(404, "playlist not found")
  }

  return res.status(200).json(new ApiResponse(200, playlist, "Playlist found"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params

  if (!playlistId && !videoId) {
    throw new ApiError(400, "Invalid Id's")
  }

  const playlist = await Playlist.findById(playlistId).populate("video")

  if (!playlist) {
    throw new ApiError(404, "playlist not found")
  }

  if (!playlist.videos.include(videoId)) {
    playlist.video.push(videoId)
  }

  await playlist.save()

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "video added to playlist successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params
  // TODO: remove video from playlist

  if (!playlistId || !videoId) {
    throw new ApiError(400, "Invalid playlistId and videoId")
  }

  const playlist = await Playlist.findById(playlistId).populate("video")

  if (!playlist) {
    throw new ApiError(400, "playlist not found")
  }

  if (playlist.video.include(videoId)) {
    playlist.videos.pull(videoId)
  }

  await playlist.save()

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed from playlist"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params

  if (!playlistId) {
    throw new ApiError(400, "Invalid playlistId")
  }

  const playlist = await Playlist.findByIdAndDelete(playlistId)

  if (!playlist) {
    throw new ApiError(400, "playlist not deleted")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Playlist deleted Successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params
  const { name, description } = req.body
  //TODO: update playlist

  if (!playlistId) {
    throw new ApiError(400, "Invalid playlistId")
  }

  const updatedFields = {}
  if (name) updatePlaylist.name = name
  if (description) updatePlaylist.description = description

  const playlist = await Playlist.findByIdAndUpdate(playlistId, updatedFields, {
    new: true,
  })

  if (!playlist) {
    throw new ApiError(400, "Some error occur during updation of playlist")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist updated succesfully"))
})

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
}
