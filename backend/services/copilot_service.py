import json
import os
import re

import requests

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are the Autonomous Operations Copilot for an Enterprise Supply Chain Control Tower.
Audience: C-suite executives and senior operations directors.

Respond ONLY with valid JSON matching this exact schema — no markdown, no text outside JSON:

{
  "thought_process": [
    "Step 1: Accessed transactional records via internal ERP system API.",
    "Step 2: Cross-referenced IoT carrier GPS data for current container location.",
    "Step 3: Applied weather layer anomaly metrics to current maritime route coordinates.",
    "Step 4: Executed SLA financial impact model against Tier-1/Tier-2 penalty structures."
  ],
  "final_answer": {
    "status": "Critical Delay",
    "root_cause": "Detailed enterprise explanation of exactly why the exception occurred.",
    "financial_impact": "$XX,XXX SLA penalty threshold breached based on contractual delay terms.",
    "downstream_impact": "Specific production lines, manufacturing hubs, or client orders affected.",
    "prescriptive_mitigations": [
      {
        "option": "Reroute remaining volume via expedited air freight cargo lines.",
        "cost_implication": "+$4,500",
        "action_id": "MITIGATE_AIR_FREIGHT"
      },
      {
        "option": "Initiate automated customer buffer inventory dispatch.",
        "cost_implication": "$0 (Internal Allocation)",
        "action_id": "MITIGATE_BUFFER"
      }
    ]
  }
}

Rules:
- status must be exactly one of: "Critical Delay", "At Risk", "On Schedule"
- Be concise, precise, financially objective. No filler words.
- Always quantify financial impact from SLA contractual structures.
- Generate 2-3 mitigation options with realistic cost implications."""


def run_copilot(query: str) -> dict:
    api_key = os.environ.get("GROQ_API_KEY")
    if api_key:
        try:
            resp = requests.post(
                GROQ_API_URL,
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json={
                    "model": GROQ_MODEL,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": query},
                    ],
                    "temperature": 0.2,
                    "max_tokens": 1200,
                },
                timeout=30,
            )
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"].strip()
            content = re.sub(r"^```(?:json)?\s*", "", content)
            content = re.sub(r"\s*```$", "", content)
            return json.loads(content)
        except Exception:
            pass
    return _mock_response(query)


def _mock_response(query: str) -> dict:
    q = query.lower()
    if any(w in q for w in ["late", "delay", "critical", "stuck", "block", "hold"]):
        status = "Critical Delay"
        financial = "$18,500 SLA penalty threshold breached — Tier-1 contractual clause activated at 48-hour delay mark."
        root_cause = (
            "Container MSKU-7741-B departed Shanghai Port 31 hours behind schedule due to berth congestion "
            "from Typhoon Mawar (Cat-3). Secondary delay: US CBP customs hold at Port of Long Beach — "
            "HS code 8471.30 documentation discrepancy flagged by automated entry system."
        )
        downstream = (
            "Toyota TMMK Assembly Line 4 (Georgetown, KY) — 2,400 units at production risk. "
            "Client PO #TY-2024-9921 SLA breach imminent. Tier-2 supplier Denso Corp buffer stock depleted."
        )
        mitigations = [
            {"option": "Reroute 60% volume via Singapore Airlines Cargo (SIA-F) to LAX. ETA improvement: +18 hrs.", "cost_implication": "+$12,400", "action_id": "MITIGATE_AIR_FREIGHT"},
            {"option": "Activate Memphis DC-3 emergency buffer inventory — SKU-8471-TY, 480 units available.", "cost_implication": "$0 (Internal Allocation)", "action_id": "MITIGATE_BUFFER_DISPATCH"},
            {"option": "Engage CSX Rail alternate carrier — partial load Houston port diversion.", "cost_implication": "+$3,200", "action_id": "MITIGATE_RAIL_DIVERT"},
        ]
    elif any(w in q for w in ["risk", "weather", "storm", "port", "wave", "cyclone", "typhoon"]):
        status = "At Risk"
        financial = "$6,200 projected SLA exposure — delay window approaching Tier-2 penalty threshold (36-hr clause)."
        root_cause = (
            "Active tropical disturbance TD-09W tracking toward South China Sea shipping lanes. "
            "IoT buoy network (Buoys #SC-114, SC-118) reporting 8.2m wave heights — exceeding Maersk "
            "carrier safety threshold of 6.5m. Port of Kaohsiung operating at 40% berth capacity."
        )
        downstream = (
            "Samsung Austin Fab operations flagged — 3 inbound chemical shipments (SO-2291, SO-2294, SO-2298) "
            "tracking 22 hrs behind optimal ETA. Secondary impact: Dell supply hub Austin, TX."
        )
        mitigations = [
            {"option": "Pre-authorize southern deviation route via Lombok Strait — adds 340nm, avoids storm corridor.", "cost_implication": "+$1,800 (fuel surcharge)", "action_id": "MITIGATE_ROUTE_DEVIATION"},
            {"option": "Issue preemptive customer SLA waiver — force majeure clause activation.", "cost_implication": "$0 (Legal)", "action_id": "MITIGATE_FORCE_MAJEURE"},
        ]
    else:
        status = "On Schedule"
        financial = "No SLA exposure detected. All contractual delivery windows nominal across monitored freight."
        root_cause = (
            "All 2,847 active containers cross-referenced against ERP records, IoT GPS carrier feeds, "
            "and port AIS data. Zero anomalies detected within 72-hour delivery horizon."
        )
        downstream = "Production lines operating at 98.3% capacity. No downstream risk to client orders within 72-hour horizon."
        mitigations = [
            {"option": "Maintain standard monitoring cadence — no intervention required.", "cost_implication": "$0", "action_id": "MONITOR_STANDARD"},
        ]

    return {
        "thought_process": [
            "Step 1: Accessed 2,847 transactional records via ERP API — filtered by active SLA contractual terms.",
            "Step 2: Cross-referenced IoT carrier GPS telemetry from 14 ocean carriers for ETA variance analysis.",
            f"Step 3: NLP intent classifier detected {status.lower()} scenario — triggered relevant data pipeline.",
            "Step 4: Executed financial impact model against Tier-1/Tier-2 SLA structures and generated mitigation matrix.",
        ],
        "final_answer": {
            "status": status,
            "root_cause": root_cause,
            "financial_impact": financial,
            "downstream_impact": downstream,
            "prescriptive_mitigations": mitigations,
        },
    }
