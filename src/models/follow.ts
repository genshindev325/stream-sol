import { model, models, Schema, Types } from "mongoose";
import MongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";
import { IUser, UserSchema } from "./user";

interface IFollow extends SoftDeleteDocument {
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

FollowSchema.plugin(MongooseDelete, {
  overrideMethods: "all",
  deletedBy: true,
  deletedByType: String,
});

const FollowModel =
  (models.Follow as SoftDeleteModel<IFollow>) ||
  model<SoftDeleteModel<IFollow>>("Follow", FollowSchema);

export default FollowModel;
