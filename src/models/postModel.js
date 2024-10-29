import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    title: String,
    content: String,
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // TODO
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", postSchema);
