import { models, model, Schema } from "mongoose";
import { IUser, UserSchema } from "./user";

export interface ILivestream {
  title: string;
  description?: string;
  thumbnail: string;
  text: string;
  link: string;
  views: number;
  creator: IUser;
  roomId: string;
  recording: boolean;
}

export const LivestreamSchema = new Schema<ILivestream>(
  {
    /// Title
    title: {
      type: String,
      required: true,
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

    /// Text
    text: {
      type: String,
      required: true,
    },

    /// Link
    link: {
      type: String,
      required: true,
    },

    /// Views
    views: {
      type: Number,
      required: true,
      default: 1,
    },

    /// Creator
    creator: {
      type: UserSchema,
      required: true,
    },

    /// Huddle Room Id
    roomId: {
      type: String,
      required: true,
      index: true,
    },

    recording: {
      type: Boolean,
      required: true,
      default: false,
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

const LivestreamModel =
  models.Livestream || model<ILivestream>("Livestream", LivestreamSchema);

export default LivestreamModel;
