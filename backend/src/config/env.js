import dotenv from "dotenv";

dotenv.config();

export default {
    PORT: process.env.PORT || 5000,
    OLLAMA_MODEL: process.env.OLLAMA_MODEL,
    OLLAMA_HOST: process.env.OLLAMA_HOST,
};