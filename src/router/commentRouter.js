import { Router } from "express";
import CommentModel from "../models/commentModel.js";
import PostModel from "../models/postModel.js";

const commentRouter = Router();

// 댓글 작성
commentRouter.post("/:postId/comments", async (req, res) => {
  const postId = req.params.postId;
  const { comment } = req.body;

  try {
    const newComment = await CommentModel.create({
      postId: postId,
      comment: comment,
    });

    // 게시글에 댓글 ID 추가
    await PostModel.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id }, // Post 모델의 comments 배열에 새로운 댓글 ID 추가
    });

    res.redirect(`/read/${postId}`);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).send("Error adding comment");
  }
});

// 댓글 수정
commentRouter.post("/:postId/comments/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;
  const { comment } = req.body;

  try {
    await CommentModel.findByIdAndUpdate(commentId, {
      $set: { comment: comment },
    });
    res.redirect(`/read/${postId}`);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).send("Error adding comment");
  }
});

// 댓글 삭제
commentRouter.post("/:postId/comments/:commentId/delete", async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    await PostModel.findByIdAndUpdate(postId, {
      $pull: { comments: commentId }, // Post 모델의 comments 배열에서 댓글 ID 제거
    });
    await CommentModel.findByIdAndDelete(commentId); // 댓글 삭제

    res.redirect(`/read/${postId}`);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).send("Error deleting comment");
  }
});

export { commentRouter };
