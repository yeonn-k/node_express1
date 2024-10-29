import express from "express";
import path from "path";
import { connectMongoose } from "./configs/mongooseConfig.js";

import { postRouter } from "./router/postRouter.js";
import { commentRouter } from "./router/commentRouter.js";
import { signupRouter } from "./router/signUpRouter.js";
import { loginRouter } from "./router/loginRouter.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongoDB Connect
connectMongoose();

app.set("views", path.join(process.cwd(), "src", "views"));
app.set("view engine", "ejs");

app.use("/", postRouter);
app.use("/", commentRouter);
app.use("/", loginRouter);
app.use("/", signupRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
