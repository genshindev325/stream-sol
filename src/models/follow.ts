import { model, models, Schema } from "mongoose";
import { IUser, UserSchema } from "./user";

interface IFollow {
  user: IUser;
  follower: IUser;
}

const FollowSchema = new Schema<IFollow>(
  {
    user: {
      type: UserSchema,
      required: true,
    },
    follower: {
      type: UserSchema,
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

const FollowModel = models.Follow || model<IFollow>("Follow", FollowSchema);

export default FollowModel;
