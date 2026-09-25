import dotenv from 'dotenv';
dotenv.config();
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OllamaEmbeddings } from "@langchain/ollama";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text", 
});

const pinecone = new PineconeClient({
    apiKey: process.env.PINECONE_API_KEY, 
});

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);


export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
});


export async function indexDocument(filePath){
    const loader = new PDFLoader(filePath, { splitPages: false })

    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,     // Target character length of each chunk
        chunkOverlap: 100,   // Number of overlapping characters between adjacent chunks
    });

    const textChunks = await splitter.splitText(docs[0].pageContent);

    const documents = textChunks.map((chunk) => {
        return {
            pageContent: chunk,
            metadata: docs[0].metadata,
        };
    });

    await vectorStore.addDocuments(documents);
}