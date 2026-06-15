import os
import random
from typing import Any, Dict, List

from langchain.agents import AgentType, Tool, initialize_agent
from langchain.llms import Groq

from rag_engine import query_shipments, setup_collection

collection = setup_collection()


def search_incident_logs(query_text: str) -> str:
    results = query_shipments(collection, query_text, top_k=5)
    if not results:
        return "No incident log results were found for that query."

    output_lines: List[str] = ["Incident log search results:"]
    for idx, result in enumerate(results, start=1):
        metadata = result.get("metadata", {})
        output_lines.append(
            f"Result {idx}: {result.get('document')}\nMetadata: {metadata}\nDistance: {result.get('distance')}"
        )
    return "\n\n".join(output_lines)


def check_inventory(sku: str) -> str:
    if not sku:
        return "Please provide a SKU to check inventory."

    quantity = random.randint(0, 250)
    status = "in stock" if quantity > 20 else "low stock" if quantity > 0 else "out of stock"
    return f"Inventory for SKU {sku}: {quantity} units available ({status})."


def get_weather_impact(location: str) -> str:
    if not location:
        return "Please provide a location for weather impact information."

    return (
        f"Weather update for {location}: heavy rain and high winds are expected in the next 24 hours, "
        "which may delay shipping by up to 8 hours. Monitor weather updates for further changes."
    )


def _build_agent() -> Any:
    groq_api_key = os.environ.get("GROQ_API_KEY")
    if not groq_api_key:
        raise EnvironmentError("Missing GROQ_API_KEY environment variable for Groq LLM.")

    llm = Groq(api_key=groq_api_key, model="llama-3-8b", temperature=0.2)

    tools = [
        Tool(
            name="search_incident_logs",
            func=search_incident_logs,
            description=(
                "Search incident logs and shipment records in the supply chain vector database. "
                "Use this tool for questions about shipment incidents, delays, or other log-based events."
            ),
        ),
        Tool(
            name="check_inventory",
            func=check_inventory,
            description=(
                "Check the inventory level for a given SKU. "
                "Provide a SKU value like 'SKU123' and return the current stock status."
            ),
        ),
        Tool(
            name="get_weather_impact",
            func=get_weather_impact,
            description=(
                "Get a simulated weather impact summary for a specified location. "
                "Use this tool when shipping delays may be caused by weather."
            ),
        ),
    ]

    return initialize_agent(
        tools,
        llm,
        agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        verbose=False,
        max_iterations=4,
        early_stopping_method="generate",
    )


_agent = _build_agent()


def run_agent(query_text: str) -> Dict[str, Any]:
    if not query_text:
        return {"answer": "", "thought_process": ["No query provided."]}

    result = _agent({"input": query_text})
    answer = result.get("output", "")
    intermediate_steps = result.get("intermediate_steps", [])

    thought_process: List[str] = []
    for step in intermediate_steps:
        tool_input, tool_output = step
        thought_process.append(f"Tool input: {tool_input}\nTool output: {tool_output}")

    return {
        "answer": answer,
        "thought_process": thought_process,
    }
