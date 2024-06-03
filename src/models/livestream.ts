import { models, model, Schema } from "mongoose";
import { IUser, UserSchema } from "./user";

export interface ILivestream {
  title: string;
  description: string;
  thumbnail: string;
  video: string;
  archived: boolean;
  text: string;
  link: string;
  likes: number;
  dislikes: number;
  views: number;
  creator: IUser;
  roomId: string;
  recording: boolean;
}

export const LivestreamSchema = new Schema<ILivestream>(
  {
    title: {
      type: String,
      required: true,
      max: 100,
    },
    description: {
      type: String,
      default: "",
      max: 200,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      default: "",
    },
    archived: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    creator: {
      type: UserSchema,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    recording: {
      type: Boolean,
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
    toObject: {
      versionKey: false,
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
