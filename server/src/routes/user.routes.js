import { Router } from "express";
import {
  accountAuthorization,
  callback,
} from "../controllers/user.controller.js";

const router = new Router();

router.route("/login").get(accountAuthorization);
router.route("/callback").get(callback);

export default router;
