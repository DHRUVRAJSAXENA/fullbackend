import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    describtion: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Playlist = mongoose.model("playlistSchema", playlistSchema);
