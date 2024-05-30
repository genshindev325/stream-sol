import { models, model, Schema } from "mongoose";

export interface IAnnouncement {
  user: string;
  content: string;
  likes: number;
  dislikes: number;
}

export const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    /// Announcer Public Key
    user: {
      type: String,
      required: true,
      index: true,
    },

    /// Announcement Content
    content: {
      type: String,
      required: true,
      max: 200,
    },

    /// Likes
    likes: {
      type: Number,
      default: 0,
    },

    /// Dislikes
    dislikes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
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

const AnnouncementModel =
  models.Announcement ||
  model<IAnnouncement>("Announcement", AnnouncementSchema);

export default AnnouncementModel;
