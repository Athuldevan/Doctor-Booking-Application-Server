import express from "express";
import tryCatch from "../../../utils/tryCatch";
import { login, logout, register } from "../controller/auth.controller";
import { validate } from "../../../utils/JoiValidatiojn";
import {
  loginValidation,
  registerValidation,
} from "../validations/auth.validation";

const router = express.Router();

router
  .route("/login")
  .post(validate({ type: "body", schema: loginValidation }), tryCatch(login));
router
  .route("/register")
  .post(
    validate({ type: "body", schema: registerValidation }),
    tryCatch(register),
  );
router.route("/logout").post(tryCatch(logout));

export default router;
