"""
Analytics API — serves computed KPIs and time-series data for the
frontend dashboard charts.  All data is deterministically generated
from a seed so the numbers look realistic and consistent within a
single session, but refresh on server restart to simulate live ops.
"""

import random
import math
from datetime import datetime, timedelta
from flask import Blueprint, jsonify

analytics_bp = Blueprint("analytics", __name__)

# ---------- helpers ----------
_SEED = int(datetime.now().timestamp()) // 3600  # changes every hour
_rng = random.Random(_SEED)


def _jitter(base: float, pct: float = 0.08) -> float:
    return round(base * (1 + _rng.uniform(-pct, pct)), 1)


# ---------- /analytics/summary ----------
@analytics_bp.route("/analytics/summary", methods=["GET"])
def analytics_summary():
    """Real-time KPI snapshot used by the Dashboard hero tiles."""
    active_shipments = _rng.randint(2780, 2920)
    critical_alerts = _rng.randint(8, 16)
    sla_exposure = round(_rng.uniform(1.8, 3.2), 1)
    avg_delay = round(_rng.uniform(4.5, 8.0), 1)
    on_time_rate = round(_rng.uniform(91.0, 97.5), 1)

    return jsonify({
        "kpis": [
            {
                "label": "Active Shipments",
                "value": f"{active_shipments:,}",
                "trend": "up",
                "trendVal": f"+{_rng.uniform(2, 6):.1f}%",
                "sublabel": "14 ocean carriers",
                "chart": [_jitter(active_shipments - i * _rng.randint(20, 60)) for i in range(7, 0, -1)],
            },
            {
                "label": "Critical Alerts",
                "value": str(critical_alerts),
                "trend": "down",
                "trendVal": f"−{_rng.randint(8, 20)}%",
                "sublabel": f"{min(critical_alerts, 3)} require action",
                "positiveDown": True,
                "chart": [_jitter(critical_alerts + i * _rng.randint(1, 4)) for i in range(7, 0, -1)],
            },
            {
                "label": "SLA Exposure",
                "value": f"${sla_exposure}M",
                "trend": "up",
                "trendVal": f"+{_rng.uniform(3, 10):.1f}%",
                "sublabel": "Tier-1 contracts",
                "chart": [round(_jitter(sla_exposure - i * 0.15), 2) for i in range(7, 0, -1)],
            },
            {
                "label": "Avg Delay",
                "value": f"{avg_delay}h",
                "trend": "down",
                "trendVal": f"−{_rng.uniform(0.5, 2.0):.1f}h",
                "sublabel": f"vs {avg_delay + _rng.uniform(0.8, 1.5):.1f}h prior week",
                "positiveDown": True,
                "chart": [round(_jitter(avg_delay + i * 0.3), 1) for i in range(7, 0, -1)],
            },
        ],
        "on_time_rate": on_time_rate,
        "total_containers": active_shipments * _rng.randint(3, 6),
        "generated_at": datetime.utcnow().isoformat() + "Z",
    })


# ---------- /analytics/trends ----------
@analytics_bp.route("/analytics/trends", methods=["GET"])
def analytics_trends():
    """30-day time-series data for the Analytics page charts."""
    today = datetime.utcnow().date()
    days = 30

    # ---- Shipment Volume Trend (area chart) ----
    volume_base = 95
    volume_data = []
    for i in range(days):
        d = today - timedelta(days=days - 1 - i)
        weekday_boost = 8 if d.weekday() < 5 else -12
        val = max(40, int(volume_base + weekday_boost + _rng.randint(-15, 15)))
        volume_data.append({"date": d.isoformat(), "shipments": val})

    # ---- Delay Causes Distribution (bar chart) ----
    delay_causes = [
        {"cause": "Weather Events", "count": _rng.randint(18, 35), "color": "#3b82f6"},
        {"cause": "Port Congestion", "count": _rng.randint(22, 40), "color": "#f59e0b"},
        {"cause": "Customs Hold", "count": _rng.randint(10, 25), "color": "#ef4444"},
        {"cause": "Carrier Delay", "count": _rng.randint(14, 28), "color": "#8b5cf6"},
        {"cause": "Documentation", "count": _rng.randint(5, 15), "color": "#06b6d4"},
        {"cause": "Equipment Issue", "count": _rng.randint(3, 12), "color": "#10b981"},
    ]

    # ---- SLA Compliance (donut chart) ----
    compliant = _rng.randint(82, 94)
    sla_compliance = {
        "compliant": compliant,
        "at_risk": _rng.randint(3, 10),
        "breached": 100 - compliant - _rng.randint(3, 10),
    }
    # Ensure sla adds up to 100
    sla_compliance["breached"] = 100 - sla_compliance["compliant"] - sla_compliance["at_risk"]

    # ---- Regional Performance (table data) ----
    regions = [
        {"lane": "Asia → North America", "volume": _rng.randint(800, 1200), "on_time": round(_rng.uniform(88, 96), 1), "avg_delay": round(_rng.uniform(4, 9), 1), "sla_exposure": f"${_rng.randint(400, 900)}K"},
        {"lane": "Asia → Europe", "volume": _rng.randint(600, 950), "on_time": round(_rng.uniform(90, 97), 1), "avg_delay": round(_rng.uniform(3, 7), 1), "sla_exposure": f"${_rng.randint(200, 600)}K"},
        {"lane": "Europe → North America", "volume": _rng.randint(300, 600), "on_time": round(_rng.uniform(92, 98), 1), "avg_delay": round(_rng.uniform(2, 5), 1), "sla_exposure": f"${_rng.randint(80, 300)}K"},
        {"lane": "Intra-Asia", "volume": _rng.randint(400, 700), "on_time": round(_rng.uniform(91, 97), 1), "avg_delay": round(_rng.uniform(2, 6), 1), "sla_exposure": f"${_rng.randint(100, 400)}K"},
        {"lane": "Middle East → Europe", "volume": _rng.randint(150, 350), "on_time": round(_rng.uniform(85, 94), 1), "avg_delay": round(_rng.uniform(5, 10), 1), "sla_exposure": f"${_rng.randint(50, 250)}K"},
    ]

    # ---- Cost Impact Over Time (line chart) ----
    cost_data = []
    cumulative = 0
    for i in range(days):
        d = today - timedelta(days=days - 1 - i)
        daily_cost = round(_rng.uniform(15, 85), 1)
        cumulative = round(cumulative + daily_cost, 1)
        cost_data.append({"date": d.isoformat(), "daily": daily_cost, "cumulative": cumulative})

    return jsonify({
        "volume_trend": volume_data,
        "delay_causes": delay_causes,
        "sla_compliance": sla_compliance,
        "regional_performance": regions,
        "cost_impact": cost_data,
        "generated_at": datetime.utcnow().isoformat() + "Z",
    })
