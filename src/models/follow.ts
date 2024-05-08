import { model, models, Schema } from "mongoose";

export interface IFollow {
  user: string;
  follower: string;
}

const FollowSchema = new Schema<IFollow>(
  {
    user: {
      type: String,
      required: true,
    },
    follower: {
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
        delete ret._id;
      },
    },
  }
);

const FollowModel = models.Follow || model("Follow", FollowSchema);

export default FollowModel;
