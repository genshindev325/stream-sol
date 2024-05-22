import exp from "constants";
import { models, model, Schema } from "mongoose";
import MongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";

export interface ILivestream extends SoftDeleteDocument {
  title: string;
  description?: string;
  thumbnail: string;
  text: string;
  link: string;
  views: number;
  creator: string;
}

export const LivestreamSchema = new Schema<ILivestream>(
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

    /// Text
    text: {
      type: String,
    },

    /// Link
    link: {
      type: String,
    },

    /// Views
    views: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value: number) {
          return Number.isInteger(value) && value >= 0;
        },
        message: "Followers must be greater than or equal to 0",
      },
    },

    /// Creator
    creator: {
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
  (models.Livestream as SoftDeleteModel<ILivestream>) ||
  model<SoftDeleteModel<ILivestream>>("Livestream", LivestreamSchema);

export default LivestreamModel;
