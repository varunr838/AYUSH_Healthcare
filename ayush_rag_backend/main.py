import os
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import tempfile
import json

# Langchain and AI imports
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Load environment variables (.env file)
load_dotenv()

app = FastAPI(title="AYUSH RAG API", version="1.0")

# --- HACKATHON CORS SETUP ---
# This allows your frontend teammate's local server to talk to your backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production this is bad, but for a 2-day hackathon, it's a lifesaver
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading embedding model...")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

llm = ChatGroq(
    temperature=0.1,
    model_name="llama-3.1-8b-instant",
    max_tokens=1024
)

# Setup directories
CHROMA_DB_DIR = "./db"
GUIDELINES_DIR = "./data/guidelines"

# Ensure directories exist
os.makedirs(CHROMA_DB_DIR, exist_ok=True)
os.makedirs(GUIDELINES_DIR, exist_ok=True)


@app.get("/")
async def root():
    return {"message": "AYUSH RAG API is running."}


@app.post("/ingest_guidelines")
async def ingest_guidelines():
    """
    Reads the Ayurveda and Siddha PDFs, chunks them, and stores them permanently in ChromaDB.
    You only need to run this ONCE per machine setup.
    """
    if not os.path.exists(GUIDELINES_DIR) or not os.listdir(GUIDELINES_DIR):
        return {"error": f"No PDFs found in {GUIDELINES_DIR}. Please add them and try again."}

    all_documents = []
    
    # 1. Load PDFs and attach metadata
    for filename in os.listdir(GUIDELINES_DIR):
        if filename.endswith(".pdf"):
            file_path = os.path.join(GUIDELINES_DIR, filename)
            print(f"Loading {filename}...")
            
            loader = PyPDFLoader(file_path)
            docs = loader.load()
            
            # Determine which system this PDF belongs to based on filename
            # Rename your PDFs to something like "ayurveda_STG.pdf" and "siddha_STG.pdf"
            system_tag = "ayurveda" if "ayurveda" in filename.lower() else "siddha" if "siddha" in filename.lower() else "general"
            
            # Inject metadata into every page so the LLM knows exactly where it came from
            for doc in docs:
                doc.metadata["system"] = system_tag
                doc.metadata["source"] = filename
                
            all_documents.extend(docs)

    print(f"Loaded {len(all_documents)} pages total.")

    # 2. Chunk the documents
    # 1000 characters with a 200 character overlap ensures we don't cut medical context in half
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, 
        chunk_overlap=200,
        separators=["\n\n", "\n", " ", ""]
    )
    
    print("Chunking documents...")
    chunks = text_splitter.split_documents(all_documents)
    print(f"Created {len(chunks)} searchable chunks.")

    # 3. Store in ChromaDB under a specific permanent collection
    print("Generating embeddings and saving to ChromaDB... (This might take a few minutes)")
    
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_DB_DIR,
        collection_name="ayush_guidelines" # Isolated collection just for the KB
    )
    
    return {
        "status": "success", 
        "message": f"Successfully ingested {len(chunks)} chunks into the permanent AYUSH Knowledge Base."
    }

@app.post("/analyze_patient")
async def analyze_patient(
    symptoms: str = Form(...),
    system_preference: str = Form("both"), # 'ayurveda', 'siddha', or 'both'
    file: UploadFile = File(None) 
):
    """
    Step 3 & 4: Processes patient data, retrieves AYUSH guidelines, and generates a structured JSON treatment plan.
    """
    print(f"Received query: '{symptoms}' | Preference: {system_preference}")

    # ---------------------------------------------------------
    # PART 1: Process Patient History (if a file was uploaded)
    # ---------------------------------------------------------
    patient_history_text = "No prior patient history or medical records provided."
    
    if file:
        print(f"Processing patient file: {file.filename}...")
        # Save the uploaded file temporarily to parse it
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
        
        try:
            loader = PyPDFLoader(tmp_path)
            patient_docs = loader.load()
            patient_history_text = "\n".join([doc.page_content for doc in patient_docs])
            print("Successfully extracted patient history.")
        except Exception as e:
            print(f"Error reading patient PDF: {e}")
            patient_history_text = "Error extracting text from provided patient file."
        finally:
            os.remove(tmp_path) # Clean up temp file

    # ---------------------------------------------------------
    # PART 2: Retrieve from Permanent AYUSH Knowledge Base
    # ---------------------------------------------------------
    print("Retrieving relevant AYUSH guidelines...")
    # Connect to our existing Chroma DB
    vectorstore = Chroma(
        persist_directory=CHROMA_DB_DIR, 
        embedding_function=embeddings,
        collection_name="ayush_guidelines"
    )

    # Set up metadata filtering based on UI dropdown
    search_kwargs = {"k": 5} # Retrieve top 5 most relevant chunks
    if system_preference.lower() in ["ayurveda", "siddha"]:
        search_kwargs["filter"] = {"system": system_preference.lower()}

    retriever = vectorstore.as_retriever(search_kwargs=search_kwargs)
    retrieved_chunks = retriever.invoke(symptoms)

    # Format the retrieved chunks so the LLM knows exactly where they came from
    formatted_guidelines = ""
    for i, chunk in enumerate(retrieved_chunks):
        source = chunk.metadata.get("source", "Unknown Source")
        formatted_guidelines += f"--- CHUNK {i+1} (Source: {source}) ---\n{chunk.page_content}\n\n"

    # ---------------------------------------------------------
    # PART 3: The RAG Prompt & LLM Call
    # ---------------------------------------------------------
    print("Generating response with Groq LLM...")
    
    prompt = f"""
    You are an expert AYUSH-aware medical assistant. 
    Your task is to analyze the patient's symptoms and history, and provide recommendations STRICTLY based on the provided AYUSH guidelines.

    AYUSH GUIDELINES:
    {formatted_guidelines}

    PATIENT HISTORY (From uploaded medical records):
    {patient_history_text}

    USER INPUT (Current Symptoms):
    {symptoms}

    TASK:
    1. Summarize likely conditions based on the symptoms.
    2. Propose Ayurvedic and/or Siddha aligned diet and lifestyle suggestions using ONLY the guidelines provided.
    3. Note any cautions, contraindications, or warnings.
    4. State exactly which document the recommendations came from.
    5. Emphasize that a clinician must review this. Do not give firm prescriptions.

    OUTPUT FORMAT:
    You must return a raw JSON object EXACTLY matching this structure. Do not include markdown formatting like ```json. Just the raw JSON.
    {{
      "summary": "Brief summary of condition...",
      "ayurveda_recommendations": ["Rec 1", "Rec 2"],
      "siddha_recommendations": ["Rec 1", "Rec 2"],
      "warnings": ["Warning 1"],
      "ayush_sources": ["Source 1", "Source 2"]
    }}
    """

    try:
        # Call Groq Llama 3
        response = llm.invoke(prompt)
        
        # Parse the JSON response so the frontend receives a clean JSON object, not a string
        # We strip markdown backticks just in case the LLM disobeys the prompt
        clean_json_string = response.content.replace("```json", "").replace("```", "").strip()
        final_json = json.loads(clean_json_string)
        
        return final_json
        
    except json.JSONDecodeError:
        print("LLM did not return valid JSON.")
        return {
            "error": "Failed to parse LLM output into JSON.",
            "raw_output": response.content
        }
    except Exception as e:
         return {"error": str(e)}

@app.post("/debug_retrieval")
async def debug_retrieval(
    symptoms: str = Form(...),
    system_preference: str = Form("both")
):
    """
    Returns the raw chunks retrieved from ChromaDB. 
    Use this to prove to the judges that the LLM is reading real medical guidelines.
    """
    vectorstore = Chroma(
        persist_directory=CHROMA_DB_DIR, 
        embedding_function=embeddings,
        collection_name="ayush_guidelines"
    )

    search_kwargs = {"k": 5}
    if system_preference.lower() in ["ayurveda", "siddha"]:
        search_kwargs["filter"] = {"system": system_preference.lower()}

    retriever = vectorstore.as_retriever(search_kwargs=search_kwargs)
    retrieved_chunks = retriever.invoke(symptoms)

    debug_output = []
    for chunk in retrieved_chunks:
        debug_output.append({
            "source": chunk.metadata.get("source", "Unknown"),
            "system": chunk.metadata.get("system", "Unknown"),
            "text": chunk.page_content
        })

    return {"retrieved_context": debug_output}