import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_classic.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import FAISS

# Path to your PDF
PDF_PATH = r"C:\Users\Krishna\Downloads\VOLUME_II_NON_COAL_2015-FULL.pdf"

# Absolute path where FAISS index will be stored
VECTORSTORE_PATH = r"C:\Users\Krishna\Desktop\dsmo\backend\vectorstore"

# Make sure the folder exists
os.makedirs(VECTORSTORE_PATH, exist_ok=True)

# Initialize sentence-transformer embeddings
embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

def get_vectorstore():
    """
    Loads or builds FAISS vectorstore from the mining PDF dataset.
    """
    index_file = os.path.join(VECTORSTORE_PATH, "index.faiss")

    if os.path.exists(index_file):
        print(f"✅ Loaded existing FAISS vectorstore from {VECTORSTORE_PATH}")
        db = FAISS.load_local(VECTORSTORE_PATH, embeddings, allow_dangerous_deserialization=True)
        return db.as_retriever(search_kwargs={"k": 5})

    # Otherwise, create new one from PDF
    print("⚙️ Creating new FAISS vectorstore from PDF...")
    loader = PyPDFLoader(PDF_PATH)
    documents = loader.load()

    # Split text into chunks for embeddings
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    docs = text_splitter.split_documents(documents)
    print(f"🔍 Split into {len(docs)} chunks")

    # Create FAISS vectorstore
    db = FAISS.from_documents(docs, embeddings)
    db.save_local(VECTORSTORE_PATH)
    print(f"✅ FAISS vectorstore created and saved locally at {VECTORSTORE_PATH}")
    
    return db.as_retriever(search_kwargs={"k": 5})

if __name__ == "__main__":
    print("🚀 Running retriever...")
    get_vectorstore()





