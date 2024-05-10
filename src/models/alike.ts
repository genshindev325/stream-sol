import { models, model, Schema, Types, ObjectId } from "mongoose";
import { PublicKey } from "@solana/web3.js";

export interface IAlike {
  user: string;
  announcement: ObjectId;
  liked: boolean;
}

export const AlikeSchema = new Schema<IAlike>(
  {
    /// User Public Key
    user: {
      type: String,
      required: true,
      index: true,
      validate: {
        validator: function (value: string) {
          const key = new PublicKey(value);
          return PublicKey.isOnCurve(key);
        },
        message: "Invalid public key",
      },
    },

    /// Announcement Content
    announcement: { type: Types.ObjectId, required: true, ref: "Announcement" },

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
