/**
 * Implementation plan
 * Stage 1: Indexting
 * 1. Load the document - pdf, text 
 * 2. Chunk the document 
 * 3. Generate vector embeddings 

 *
 * Stage 2: Using the chatbot
 * 1. Setup LLM 
 * 2. Add retrieval step
 * 3. Pass input + relevant information to LLM
 * 4. Get the result from LLM
*/

import { indexDocument } from "./pdf-load.js";

const filePath = './cg-internal-docs.pdf';
indexDocument(filePath)