import express from "express";

import {
  getMessages,
  markMessageRead,
  markMessageUnread,
  markMessageReplied,
} from "../controllers/messageController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Admin protected routes
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  protect,
  getMessages
);

router.patch(
  "/:id/read",
  protect,
  markMessageRead
);

router.patch(
  "/:id/unread",
  protect,
  markMessageUnread
);

router.patch(
  "/:id/replied",
  protect,
  markMessageReplied
);

export default router;