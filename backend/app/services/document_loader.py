from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from .vectorstore import get_vector_store


def ingest_pdf(file_path: str):
    loader = PyPDFLoader(file_path)
    documents = loader.load()

    print("Loaded documents:", len(documents))

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = text_splitter.split_documents(documents)

    print("Chunks created:", len(chunks))

    if not chunks:
        return 0

    vectorstore = get_vector_store()
    vectorstore.add_documents(chunks)

    # 🔥 THIS LINE IS IMPORTANT
    vectorstore.persist()

    return len(chunks)