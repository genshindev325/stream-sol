import { models, model, Schema } from "mongoose";
import MongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";
import { PublicKey } from "@solana/web3.js";

export interface IUser extends SoftDeleteDocument {
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

export const UserSchema = new Schema<IUser>(
  {
    /// Username
    username: {
      type: String,
      required: true,
      index: true,
      max: 12,
    },

    /// Public Key
    publickey: {
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

    /// First Name
    firstname: {
      type: String,
      required: true,
      max: 18,
    },

    /// Last Name
    lastname: {
      type: String,
      required: false,
      max: 18,
    },

    /// Description
    description: {
      type: String,
      required: false,
      max: 200,
    },

    /// Followers
    followers: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value: number) {
          return Number.isInteger(value) && value >= 0;
        },
        message: "Followers must be greater than or equal to 0",
      },
    },

    /// Followings
    followings: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value: number) {
          return Number.isInteger(value) && value >= 0;
        },
        message: "Followings must be greater than or equal to 0",
      },
    },

    /// Avatar
    avatar: String,

    /// Banner
    banner: String,
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
    // toObject: {
    //   versionKey: false,
    //   transform: (_, ret) => {
    //     ret.id = ret._id.toString();
    //     delete ret._id;
    //   },
    // },
  }
);

UserSchema.virtual("fullname").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

UserSchema.plugin(MongooseDelete, {
  overrideMethods: "all",
  deletedBy: true,
  deletedByType: String,
});

const UserModel =
  (models.User as SoftDeleteModel<IUser>) ||
  model<SoftDeleteModel<IUser>>("User", UserSchema);

export default UserModel;
