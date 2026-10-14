
import math
import yfinance as yf

from langchain_core.tools import tool
from rag import rag_chain


@tool
def search_annual_report(query: str) -> str:
    """
    Search the Reliance Industries annual report for historical
    financial results, revenue, profit, business segments, risks,
    and other company information.

    Use this tool for questions that can be answered from the
    annual report.
    """
    try:
        result = rag_chain(query)

        if not result:
            return "No relevant answer was returned from the annual report."

        return str(result)

    except Exception as e:
        return f"Annual report search failed: {e}"


@tool
def get_stock_price(ticker: str) -> str:
    """
    Retrieve the latest available valid daily closing price and
    recent trading data using a Yahoo Finance ticker.

    Use RELIANCE.NS for Reliance Industries listed in India.

    This tool returns daily market data, not a guaranteed
    real-time stock quote.
    """
    try:
        ticker = ticker.strip().upper()

        if not ticker:
            return "Please provide a valid Yahoo Finance ticker."

        stock = yf.Ticker(ticker)

        history = stock.history(
            period="5d",
            interval="1d",
            auto_adjust=False
        )

        if history.empty or "Close" not in history.columns:
            return (
                f"No closing-price data found for {ticker}. "
                "Check the ticker or try again later."
            )

        # Remove rows with missing closing prices.
        history = history.dropna(subset=["Close"])

        # Check whether any valid prices remain.
        if history.empty:
            return f"No valid closing prices are available for {ticker}."

        # Select the most recent row with a valid closing price.
        latest = history.iloc[-1]
        price = float(latest["Close"])

        if not math.isfinite(price) or price <= 0:
            return f"The closing price returned for {ticker} is invalid."

        trading_date = history.index[-1].strftime("%Y-%m-%d")

        # Yahoo Finance commonly reports Indian-listed shares in INR.
        # State the currency cautiously rather than assuming it for
        # every possible ticker.
        currency = stock.fast_info.get("currency", "Unknown")

        return (
            f"Ticker: {ticker}\n"
            f"Latest available daily closing price: {price:.2f}\n"
            f"Currency: {currency}\n"
            f"Trading date: {trading_date}\n"
            "Source: Yahoo Finance via yfinance.\n"
            "Note: This is the latest valid daily close returned by "
            "the provider, not necessarily a live market price."
        )

    except Exception as e:
        return f"Stock-price retrieval failed for {ticker}: {e}"


# Tools available to the FinAgent.
TOOLS = [
    search_annual_report,
    get_stock_price
]


if __name__ == "__main__":
    print("\n--- Annual Report Tool Test ---")

    result = search_annual_report.invoke({
        "query": "What are the major business segments?"
    })
    print(result)

    print("\n--- Stock Price Tool Test ---")

    result = get_stock_price.invoke({
        "ticker": "RELIANCE.NS"
    })
    print(result)
