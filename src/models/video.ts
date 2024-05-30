import { models, model, Schema } from "mongoose";

export interface IVideo {
  title: string;
  description?: string;
  thumbnail: string;
  creator: string;
  roomId: string;
  url: string;
}

export const VideoSchema = new Schema<IVideo>(
  {
    /// Title
    title: {
      type: String,
      required: true,
      index: true,
      max: 100,
    },

    /// Description
    description: {
      type: String,
      required: false,
      max: 200,
    },

    /// Thumbnails
    thumbnail: {
      type: String,
      required: true,
    },

    /// Creator
    creator: {
      type: String,
      required: true,
    },

    /// Saved recording video url
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
      },
    },
  }
);

const VideoModel = models.Video || model<IVideo>("Video", VideoSchema);

export default VideoModel;
