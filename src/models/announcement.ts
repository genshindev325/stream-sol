import { models, model, Schema } from "mongoose";
import MongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";
import { PublicKey } from "@solana/web3.js";

export interface IAnnouncement extends SoftDeleteDocument {
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
      validate: {
        validator: function (value: string) {
          const key = new PublicKey(value);
          return PublicKey.isOnCurve(key);
        },
        message: "Invalid public key",
      },
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
      validate: {
        validator: function (value: number) {
          return Number.isInteger(value) && value >= 0;
        },
        message: "Likes must be greater than or equal to 0",
      },
    },

    /// Dislikes
    dislikes: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value: number) {
          return Number.isInteger(value) && value >= 0;
        },
        message: "Dislikes must be greater than or equal to 0",
      },
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

AnnouncementSchema.plugin(MongooseDelete, {
  overrideMethods: "all",
  deletedBy: true,
  deletedByType: String,
});

const AnnouncementModel =
  (models.Announcement as SoftDeleteModel<IAnnouncement>) ||
  model<SoftDeleteModel<IAnnouncement>>("Announcement", AnnouncementSchema);

export default AnnouncementModel;
