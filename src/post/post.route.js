const express = require("express");
const router = express.Router();
const postController = require("../post/post.controller");

router.get("/", postController.appAssement);
router.post("/add-post", postController.upload);
router.get("/fetch", postController.fetchPost);
router.get("/image/:name", postController.download);
router.post("/reply-to-comment", postController.replyToComment);
module.exports = router;
