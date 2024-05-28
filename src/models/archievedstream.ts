import exp from "constants";
import { models, model, Schema } from "mongoose";
import { SoftDeleteDocument, SoftDeleteModel } from "mongoose-delete";
import { IUser, UserSchema } from "./user";

export interface IArchievedstream extends SoftDeleteDocument {
  title: string;
  description?: string;
  thumbnail: string;
  creator: string;
  roomId: string;
  video?: string;
}

export const ArchievedstreamSchema = new Schema<IArchievedstream>(
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

    /// Huddle Room Id
    roomId: {
      type: String,
      required: true,
    },

    /// Saved recording video url
    video: {
      type: String,
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

const ArchievedstreamModel =
  (models.Archievedstream as SoftDeleteModel<IArchievedstream>) ||
  model<SoftDeleteModel<IArchievedstream>>(
    "Archievedstream",
    ArchievedstreamSchema
  );

export default ArchievedstreamModel;
