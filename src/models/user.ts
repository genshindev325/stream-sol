import { model, models, Schema } from "mongoose";

export interface IUser {
  firstname: string;
  lastname?: string;
  username: string;
  description?: string;
  publickey: string;
}
const UserSchema = new Schema<IUser>(
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

const UserModel = models.User || model("User", UserSchema);

export default UserModel;
