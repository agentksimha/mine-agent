from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain.vectorstores import FAISS

# Load sentence-transformer embeddings
embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

def get_vectorstore():
    try:
        db = FAISS.load_local("mine_docs", embeddings, allow_dangerous_deserialization=True)
        print("✅ Loaded existing FAISS vectorstore.")
    except Exception:
        print("⚠️ No vectorstore found, creating new one.")
        db = FAISS.from_texts(["Welcome to Digital Mine Safety Officer knowledge base."], embeddings)
        db.save_local("mine_docs")
    return db.as_retriever(search_kwargs={"k": 5})
