import { models, model, Schema } from "mongoose";
import MongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";

interface IUserDocument extends SoftDeleteDocument {
  firstname: string;
  lastname?: string;
  username: string;
  description?: string;
  publickey: string;
  avatar?: string;
  banner?: string;
  followers: number;
  followings: number;
}

const UserSchema = new Schema<IUserDocument>(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    publickey: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    banner: {
      type: String,
      required: false,
    },
    followers: {
      type: Number,
      default: 0,
    },
    followings: {
      type: Number,
      default: 0,
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

UserSchema.plugin(MongooseDelete, {
  overrideMethods: "all",
  deletedBy: true,
  deletedByType: String,
});

const UserModel =
  (models.User as SoftDeleteModel<IUserDocument>) ||
  model<IUserDocument, SoftDeleteModel<IUserDocument>>("User", UserSchema);

export default UserModel;
