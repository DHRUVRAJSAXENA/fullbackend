import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params
  const subscriberId = req.user._id

  if (!channelId || subscriberId) {
    throw new ApiError(400, "channelId or subscriberId is invalid")
  }

  const existingSubsriber = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  })

  if (existingSubsriber) {
    await existingSubsriber.deleteOne()

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Channel Unsubscribed Successfully"))
  } else {
    const newSubscriber = new Subscription({
      channel: channelId,
      subscriber: subscriberId,
    })

    await Subscription.save()

    return res
      .status(200)
      .json(
        new ApiResponse(200, Subscription, "Channel subscribed successfully")
      )
  }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params

  if (!channelId) {
    throw new ApiError(400, "Invalid channelId")
  }

  const channelSubscribers = await Subscription.findOne({
    channel: channelId,
  }).populate("subscriber")

  if (!channelSubscribers) {
    throw new ApiError(404, "channelSubscribers not found")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelSubscribers,
        "Channel Subscribers Fetched Successfully"
      )
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params

  if (!subscriberId) {
    throw new ApiError(400, "invalid subscriberId")
  }

  const subscribedChannels = await Subscription.findOne({
    subscriber: subscriberId,
  }).populate("channel")

  if (!subscribedChannels) {
    throw new ApiError(404, "subscribedChannels not found")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannels,
        "Subscribed Channels successfully fetched"
      )
    )
})

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels }
