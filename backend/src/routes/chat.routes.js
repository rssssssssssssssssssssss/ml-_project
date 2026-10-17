import express from "express";
import multer from "multer";
import { chat, transcribeAudio } from "../controllers/chat.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/", chat);
router.post("/transcribe", upload.single("audio"), transcribeAudio);

export default router;