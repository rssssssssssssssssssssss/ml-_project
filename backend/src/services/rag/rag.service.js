import axios from "axios";

export async function getRelevantContext(question) {
    try {

        const response = await axios.post(
            "http://127.0.0.1:8000/retrieve",
            {
                question,
            }
        );

        if (!response.data.success) {
            return "";
        }

        return response.data.context.join("\n\n");

    } catch (err) {

        console.error("RAG Error:", err.message);
        return "";

    }
}