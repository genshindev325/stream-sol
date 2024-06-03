import { models, model, Schema, Types, ObjectId } from "mongoose";

export interface ISlike {
  user: string;
  livestreamId: ObjectId;
  liked: boolean;
}

export const SlikeSchema = new Schema<ISlike>(
  {
    user: {
      type: String,
      required: true,
      index: true,
    },

    livestreamId: {
      type: Types.ObjectId,
      required: true,
      ref: "Livestream",
    },

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

const SlikeModel = models.Slike || model<ISlike>("Slike", SlikeSchema);

export default SlikeModel;
