import mongoose from "mongoose";
import UserModel from "@/models/user";
import FollowModel from "@/models/follow";
import AnnouncementModel from "@/models/announcement";
import AlikeModel from "@/models/alike";

const MONGO_URI = process.env.MONGODB_URI as string;

const cached: {
  connection?: typeof mongoose;
  promise?: Promise<typeof mongoose>;
} = {};

async function connectMongo() {
  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.local"
    );
  }
  if (cached.connection) {
    return cached.connection;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGO_URI, opts);
  }
  try {
    cached.connection = await cached.promise;
  } catch (e) {
    cached.promise = undefined;
    throw e;
  }

  UserModel.watch([], { fullDocument: "updateLookup" }).on(
    "change",
    async (change) => {
      if (change.operationType === "update") {
        await FollowModel.updateMany(
          {
            "follower._id": change.documentKey._id,
          },
          {
            $set: {
              follower: change.fullDocument,
            },
          }
        );

        await FollowModel.updateMany(
          {
            "user._id": change.documentKey._id,
          },
          {
            $set: {
              user: change.fullDocument,
            },
          }
        );
      }
    }
  );

  AnnouncementModel.watch([], { fullDocument: "updateLookup" }).on(
    "change",
    async (change) => {
      if (change.operationType === "delete") {
        await AlikeModel.deleteMany({
          announcementId: change.documentKey._id,
        });
      }
    }
  );

  return cached.connection;
}
export default connectMongo;
