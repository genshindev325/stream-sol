import { models, model, Schema } from "mongoose";
import { PublicKey } from "@solana/web3.js";

export interface IUser {
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
    },

    /// Followings
    followings: {
      type: Number,
      default: 0,
    },

    /// Avatar
    avatar: {
      type: String,
      required: false,
    },

    /// Banner
    banner: {
      type: String,
      required: false,
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

UserSchema.virtual("fullname").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

const UserModel = models.User || model<IUser>("User", UserSchema);

export default UserModel;
