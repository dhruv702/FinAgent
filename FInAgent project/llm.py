
from langchain_ollama import ChatOllama


def create_llm():
    return ChatOllama(
        model="qwen3:0.6b",
        temperature=0.1,
        num_predict=256,
        num_ctx=2048,
        keep_alive="10m"
    )


if __name__ == "__main__":
    llm = create_llm()
    response = llm.invoke(
        "Explain RAG in two sentences. /no_think"
    )
    print(response.content)