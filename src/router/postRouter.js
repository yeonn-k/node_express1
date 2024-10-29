import { Router } from "express";
import PostModel from "../models/postModel.js";
const postRouter = Router();

// view routes

postRouter.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1; // 요청 페이지 번호(현재 페이지)
    const pagePerSize = 10; // 페이지당 보여줄 수
    const totalPosts = await PostModel.countDocuments(); // 총 게시글 수
    const totalPages = Math.ceil(totalPosts / pagePerSize);

    // 1 -> 0
    // 2 -> 10
    // 3 -> 20
    const offset = (page - 1) * pagePerSize;

    const posts = await PostModel.find().skip(offset).limit(pagePerSize).sort({
      createdAt: -1,
    });

    // page block(한번에 5개씩)
    const blockSize = 5;
    const block = Math.ceil(page / blockSize); // 1, 2, 3

    // 1 -> 1
    // 2 -> 6
    // 3 -> 11
    const startPage = (block - 1) * blockSize + 1;
    const endPage = Math.min(block * blockSize, totalPages);
    // 1 -> 1, 5
    // 2 -> 6, 10

    res.render("index", {
      posts,
      pagination: {
        page,
        pagePerSize,
        totalPosts,
        totalPages,
        block,
        startPage,
        endPage,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

// 글 작성 페이지
postRouter.get("/write", (req, res) => {
  res.render("write");
});

// 글 수정 페이지
postRouter.get("/update/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await PostModel.findById(postId);
    res.render("update", {
      post,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

// 글 상세 페이지
postRouter.get("/read/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await PostModel.findById(postId).populate("comments");
    console.log(post);
    res.render("detail", {
      post,
      comments: post.comments,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

// 글 작성
postRouter.post("/posts", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).send("Please enter a title or content");
    }
    const createdPost = PostModel.create({
      title,
      content,
    });
    return res.redirect("/");
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

// 글 삭제
postRouter.post("/posts-delete", async (req, res) => {
  try {
    const { postId } = req.body;
    await PostModel.findByIdAndDelete(postId);
    return res.redirect("/");
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

// 글 수정
postRouter.post("/posts-update", async (req, res) => {
  try {
    const { postId, title, content } = req.body;
    await PostModel.findByIdAndUpdate(postId, {
      title,
      content,
    });
    return res.redirect(`/read/${postId}`);
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
});

export { postRouter };
