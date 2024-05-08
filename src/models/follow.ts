import { model, models, Schema } from "mongoose";
import MongooseDelete, {
  SoftDeleteDocument,
  SoftDeleteModel,
} from "mongoose-delete";

interface IFollowDocument extends SoftDeleteDocument {
  user: string;
  follower: string;
}

const FollowSchema = new Schema<IFollowDocument>(
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

FollowSchema.plugin(MongooseDelete, {
  overrideMethods: "all",
  deletedBy: true,
  deletedByType: String,
});

const FollowModel =
  (models.Follow as SoftDeleteModel<IFollowDocument>) ||
  model<IFollowDocument, SoftDeleteModel<IFollowDocument>>(
    "Follow",
    FollowSchema
  );

export default FollowModel;
