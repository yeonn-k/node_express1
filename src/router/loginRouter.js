import { Router } from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";

const loginRouter = Router();

loginRouter.get("/login", (req, res) => {
  res.render("login");
});

loginRouter.post("/login", async (req, res) => {
  try {
    const { id, password } = req.body;
    const user = await UserModel.findOne({
      id: id,
    });

    if (!user) {
      return res.status(404).send("ID를 확인해주세요");
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).send("비밀번호가 일치하지 않습니다.");
    }

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Sever Error");
  }
});

export { loginRouter };
