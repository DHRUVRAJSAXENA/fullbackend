import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
  {
    videofile: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Video = mongoose.model("Video", videoSchema);
