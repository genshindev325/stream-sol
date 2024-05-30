import { models, model, Schema } from "mongoose";

export interface IChat {
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

const ChatModel = models.Chat || model<IChat>("Chat", ChatSchema);

export default ChatModel;
