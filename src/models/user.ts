import { models, model, Schema } from "mongoose";
import MongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";
import { PublicKey } from "@solana/web3.js";
import uniqueValidator from "mongoose-unique-validator";

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
    firstname: {
      type: String,
      required: true,
      max: 18,
    },
    lastname: {
      type: String,
      required: false,
      max: 18,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      max: 12,
    },
    description: {
      type: String,
      required: false,
      max: 200,
    },
    publickey: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value: string) {
          const key = new PublicKey(value);
          return PublicKey.isOnCurve(key);
        },
        message: "Invalid public key",
      },
    },
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
    followings: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value: number) {
          return Number.isInteger(value) && value >= 0;
        },
        message: "Followers must be greater than or equal to 0",
      },
    },
    avatar: String,
    banner: String,
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

UserSchema.virtual("fullname").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

UserSchema.plugin(uniqueValidator);

UserSchema.plugin(MongooseDelete, {
  overrideMethods: "all",
  deletedBy: true,
  deletedByType: String,
});

const UserModel =
  (models.User as SoftDeleteModel<IUser>) ||
  model<SoftDeleteModel<IUser>>("User", UserSchema);

// UserModel.watch().on("change", async (change) => {
//   console.log(change);

// if (change.operationType === "update") {
//   const follows = await FollowModel.updateMany(
//     {
//       "user._id": change.documentKey._id,
//     },
//     {
//       $set: {
//         user: {
//           ...change.updateDescription.updatedFields,
//         },
//       },
//     }
//   );
// }
// });

export default UserModel;
