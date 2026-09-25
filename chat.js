import dotenv from 'dotenv';
dotenv.config();
import readline from 'node:readline/promises';
import Groq from 'groq-sdk';
import { vectorStore } from './pdf-load.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chat() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    while (true) {
        const question = await rl.question('You: ');

        if (question === '/bye') {
            break;
        }

        // retrieval step start from here

        const relevantChunks = await vectorStore.similaritySearch(question, 3);
        const data = relevantChunks.map((chunk) => chunk.pageContent).join('\n\n');


        const SYSTEM_PROMPT = `You are an assistant for question-answering tasks. Use the following relevant pieces of retrieved context to answer the question. If you don't know the answer, say I don't know.`;


        const userQuery = `Question: ${question}
            Relevant context: ${data}
            Answer:
        `;


        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT,
                },
                {
                    role: 'user',
                    content: userQuery,
                },
            ],
            model: "openai/gpt-oss-120b",
            max_completion_tokens:200
        });

        console.log(`Assistant: ${completion.choices[0].message.content}`);
    }

    rl.close();
}

chat();
