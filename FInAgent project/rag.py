
from pathlib import Path

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_classic.chains import RetrievalQA

from llm import create_llm


BASE_DIR = Path(__file__).resolve().parent
PDF_PATH = BASE_DIR / "data" / "reliance_annual_report.pdf"
DB_PATH = BASE_DIR / "vector_db"


def process_pdf(file_path=PDF_PATH):
    if not Path(file_path).exists():
        raise FileNotFoundError(f"PDF not found: {file_path}")

    loader = PyPDFLoader(str(file_path))
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_documents(documents)

    if not chunks:
        raise ValueError("No text extracted from the PDF.")

    print(f"Loaded {len(documents)} pages.")
    print(f"Created {len(chunks)} chunks.")

    return chunks


embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


vector_store = Chroma(
    embedding_function=embeddings,
    collection_name="financial_report_collection",
    persist_directory=str(DB_PATH)
)


def ingest_data():
    chunks = process_pdf()

    vector_store.add_documents(chunks)

    return "Data ingestion completed."



def rag_chain(query: str):
    llm = create_llm()

    retriever = vector_store.as_retriever(
        search_kwargs={"k": 3}
    )

    chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever
    )

    response = chain.invoke({"query": query})

    return response["result"]


if __name__ == "__main__":
    ingest_data()

    query = input("Enter your question about the annual report: ")

    response = rag_chain(query)

    print("\nAnswer:\n")
    print(response)
