import { models, model, Schema, Types, ObjectId } from "mongoose";

export interface IAlike {
  user: string;
  announcementId: ObjectId;
  liked: boolean;
}

export const AlikeSchema = new Schema<IAlike>(
  {
    /// User Public Key
    user: {
      type: String,
      required: true,
      index: true,
    },

    /// Announcement Object Id
    announcementId: {
      type: Types.ObjectId,
      required: true,
      ref: "Announcement",
    },

    /// Likes
    liked: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: false,
    toJSON: {
      versionKey: false,
      transform: (_, ret) => {
        delete ret._id;
      },
    },
  }
);

const AlikeModel = models.Alike || model<IAlike>("Alike", AlikeSchema);

export default AlikeModel;
