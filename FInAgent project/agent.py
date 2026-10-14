
import gradio as gr
from langchain.agents import create_agent

from llm import create_llm
from shared_tools import search_annual_report, get_stock_price
from system_prompt import SYSTEM_PROMPT



tools = [
    search_annual_report,
    get_stock_price
]

llm = create_llm()


finagent = create_agent(
    model=llm,
    tools=tools,
    system_prompt=SYSTEM_PROMPT
)


def run_agent(question: str) -> str:
    if not question or not question.strip():
        return "Please enter a financial question."

    try:
        response = finagent.invoke({
            "messages": [
                {"role": "user", "content": question.strip()}
            ]
        })

        return response["messages"][-1].content

    except Exception as e:
        return f"An error occurred: {e}"


def deploy_agent():
    with gr.Blocks(title="FinAgent") as interface:
        gr.Markdown("# FinAgent")
        gr.Markdown(
            "Ask questions about Reliance Industries' annual report "
            "or its latest available stock-market data."
        )

        question = gr.Textbox(
            label="Your financial question",
            placeholder=(
                "Example: What are Reliance's business segments?"
            ),
            lines=3
        )

        submit_button = gr.Button("Ask FinAgent", variant="primary")
        output = gr.Textbox(
            label="FinAgent's Answer",
            lines=12
        )

        submit_button.click(
            fn=run_agent,
            inputs=question,
            outputs=output
        )

    interface.launch()

if __name__ == "__main__":
    deploy_agent()
