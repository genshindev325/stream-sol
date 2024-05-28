import { models, model, Schema } from "mongoose";
import { SoftDeleteDocument, SoftDeleteModel } from "mongoose-delete";

export interface IChat extends SoftDeleteDocument {
  livestreamId: string;
  roomId: string;
  sender: string;
  content: string;
}

export const ChatSchema = new Schema<IChat>(
  {
    /// Livestream Object Id
    livestreamId: {
      type: String,
      required: true,
    },

    /// Huddle Room Id
    roomId: {
      type: String,
      required: true,
    },

    /// Chat Sender username
    sender: {
      type: String,
      required: true,
    },

    /// Chat message content
    content: {
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
        ret.id = ret._id.toString();
        delete ret._id;
      },
    },
  }
);

const ChatModel =
  (models.Chat as SoftDeleteModel<IChat>) ||
  model<SoftDeleteModel<IChat>>("Chat", ChatSchema);

export default ChatModel;
