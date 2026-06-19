import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function getRelevantContext(question) {
    try {
        const { stdout } = await execFileAsync(
        "python",
        [
            "-X",
            "utf8",
            "rag/query.py",
            question,
        ],
        {
            cwd: process.cwd(),
        }
    );

        const result = JSON.parse(stdout);

        if (!result.success) {
            return "";
        }

        return result.context.join("\n\n");
    } catch (err) {
        console.error("RAG Error:", err);
        return "";
    }
}