import { Router } from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";

const signupRouter = Router();

signupRouter.get("/signup", (req, res) => {
  res.render("signup");
});

signupRouter.post("/signup", async (req, res) => {
  try {
    const { id, password, passwordConfirm, name } = req.body;
    if (!id || !password || !passwordConfirm || !name) {
      return res.status(400).send("Please enter all input box");
    }
    if (password !== passwordConfirm) {
      return res.status(400).send("비밀번호가 일치하지 않습니다.");
    }

    const users = await UserModel.find().where("id").equals(id);

    if (users.length > 0) {
      return res.status(404).send("중복된 ID입니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      id,
      password: hashedPassword,
      name,
    });

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export { signupRouter };
