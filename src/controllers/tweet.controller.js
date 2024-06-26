import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body
  const userId = req.user._id

  if (!content) {
    throw new ApiError(400, "undefined content")
  }

  const tweet = new Tweet({
    content: content,
    owner: userId,
  })

  if (!tweet) {
    throw new ApiError(400, "tweet undefined")
  }

  await tweet.save()

  return res.status(200).json(200, tweet, "tweeted successfully")
})

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const userId = req.user._id

  const tweets = await Tweet.find({ owner: userId })

  if (!tweets.length) {
    throw new ApiError(404, "tweets not found")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "all tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params
  const { content } = req.body
  const userId = req.user._id

  if (!content) {
    throw new ApiError(400, "Undefined content")
  }

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Undefined tweetId")
  }

  const tweet = await Tweet.findById(tweetId)

  if (!tweet) {
    throw new ApiError(404, "Tweet not found")
  }

  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(400, "you are unauthorised")
  }

  tweet.content = content

  await tweet.save()

  return res
    .status(200)
    .json(new ApiResponse(200, "Content of tweet updated succesfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params
  const userId = req.user._id

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweetId")
  }

  const tweet = await Tweet.findById(tweetId)

  if (tweet.owner.toString() != userId.toString()) {
    throw new ApiError("Unauthorised deletion of tweet")
  }

  tweet.deleteOne()
  await tweet.save()

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Tweet deleted succesfully"))
})

export { createTweet, getUserTweets, updateTweet, deleteTweet }
