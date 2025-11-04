import os
from langchain_classic.agents import initialize_agent, Tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_classic.chains import ConversationalRetrievalChain
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv

# ---------------------------------------------------
# CONFIG
# ---------------------------------------------------
import pathlib

# Base directory = this script's parent folder
BASE_DIR = pathlib.Path(__file__).resolve().parent
VECTORSTORE_PATH = BASE_DIR / "vectorstore"
load_dotenv()  # reads .env file from project root

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("❌ GOOGLE_API_KEY not found. Set it as an environment variable.")

# ---------------------------------------------------
# LLM setup (Gemini)
# ---------------------------------------------------
MODEL_NAME = "gemini-2.5-flash"
llm = ChatGoogleGenerativeAI(
    model=MODEL_NAME,
    google_api_key=GOOGLE_API_KEY,
    temperature=0.2
)

# ---------------------------------------------------
# Load FAISS retriever
# ---------------------------------------------------
print(f"🔍 Loading FAISS vectorstore from: {VECTORSTORE_PATH}")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

if not os.path.exists(os.path.join(VECTORSTORE_PATH, "index.faiss")):
    raise FileNotFoundError(
        f"❌ No FAISS index found at {VECTORSTORE_PATH}. Run retriever.py first to create it."
    )

db = FAISS.load_local(VECTORSTORE_PATH, embeddings, allow_dangerous_deserialization=True)
retriever = db.as_retriever(search_kwargs={"k": 5})

# ---------------------------------------------------
# RAG Chain (with conversational context)
# ---------------------------------------------------
qa_chain = ConversationalRetrievalChain.from_llm(llm, retriever=retriever)

# store chat history for context-aware responses
chat_history = []

# ---------------------------------------------------
# Define tools
# ---------------------------------------------------
def query_knowledge(query: str):
    """Query the mining knowledgebase (RAG)"""
    global chat_history
    response = qa_chain.invoke({
        "question": query,
        "chat_history": chat_history
    })
    # update history
    chat_history.append((query, response["answer"]))
    return response["answer"]

def run_rules_engine(input_text: str):
    """Apply rule-based checks (e.g., methane safety)"""
    if "methane" in input_text.lower():
        data = {"methane_ppm": 6000}
    else:
        data = {"incidents": 1, "methane_ppm": 1000}
    return evaluate_rules(data)

tools = [
    Tool(
        name="KnowledgeQuery",
        func=query_knowledge,
        description="Answer factual or data-driven mining questions."
    ),
    Tool(
        name="SafetyRules",
        func=run_rules_engine,
        description="Evaluate mine safety or compliance conditions."
    ),
]

# ---------------------------------------------------
# Initialize Agent
# ---------------------------------------------------
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent_type="chat-conversational-react-description",
    verbose=True,
    handle_parsing_errors=True
)


