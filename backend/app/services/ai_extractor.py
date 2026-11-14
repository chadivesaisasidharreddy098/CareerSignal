"""AI Intelligence extraction service using Google Gemini API with robust heuristic fallback."""

import os
import re
import json
import logging
from typing import Optional, Tuple
from datetime import datetime

from app.config import get_settings
from app.schemas import SignalCreate

logger = logging.getLogger("careersignal.ai_extractor")
settings = get_settings()

# Known geographic coordinates database for common tech/business hubs
GEO_COORDINATES = {
    "austin": (30.2672, -97.7431, "United States"),
    "san francisco": (37.7749, -122.4194, "United States"),
    "silicon valley": (37.3861, -122.0839, "United States"),
    "seattle": (47.6062, -122.3321, "United States"),
    "new york": (40.7128, -74.0060, "United States"),
    "chicago": (41.8781, -87.6298, "United States"),
    "boston": (42.3601, -71.0589, "United States"),
    "detroit": (42.3314, -83.0458, "United States"),
    "london": (51.5074, -0.1278, "United Kingdom"),
    "berlin": (52.5200, 13.4050, "Germany"),
    "munich": (48.1351, 11.5820, "Germany"),
    "frankfurt": (50.1109, 8.6821, "Germany"),
    "paris": (48.8566, 2.3522, "France"),
    "dublin": (53.3498, -6.2603, "Ireland"),
    "amsterdam": (52.3676, 4.9041, "Netherlands"),
    "rotterdam": (51.9244, 4.4777, "Netherlands"),
    "stockholm": (59.3293, 18.0686, "Sweden"),
    "singapore": (1.3521, 103.8198, "Singapore"),
    "tokyo": (35.6762, 139.6503, "Japan"),
    "bengaluru": (12.9716, 77.5946, "India"),
    "bangalore": (12.9716, 77.5946, "India"),
    "hyderabad": (17.3850, 78.4867, "India"),
    "sydney": ( -33.8688, 151.2093, "Australia"),
    "toronto": (43.6532, -79.3832, "Canada"),
    "são paulo": (-23.5505, -46.6333, "Brazil"),
    "sao paulo": (-23.5505, -46.6333, "Brazil"),
    "mexico city": (19.4326, -99.1332, "Mexico"),
    "jakarta": (-6.2088, 106.8456, "Indonesia"),
    "beijing": (39.9042, 116.4074, "China"),
    "shanghai": (31.2304, 121.4737, "China"),
}


def heuristic_extract_signal(text: str, source_url: Optional[str] = None, source_name: Optional[str] = None) -> SignalCreate:
    """Intelligent heuristic parser for career/layoff/hiring signals from news text."""
    lower_text = text.lower()

    # Determine signal classification
    layoff_keywords = ["layoff", "layoffs", "cut", "cuts", "cutting", "fired", "downsizing", "slashes", "axing", "severance", "job losses", "redundancies"]
    expansion_keywords = ["expansion", "expanding", "opens", "opened", "campus", "facility", "r&d center", "invests", "investment", "new hub"]
    restructure_keywords = ["restructuring", "reorganization", "pivot", "streamline", "rto", "return-to-office", "return to office", "voluntary buyout"]
    hiring_keywords = ["hire", "hiring", "hires", "recruiting", "recruit", "vacancies", "headcount addition", "adding roles"]

    signal_type = "hiring_surge"
    if any(k in lower_text for k in layoff_keywords):
        signal_type = "layoff"
    elif any(k in lower_text for k in restructure_keywords):
        signal_type = "restructuring"
    elif any(k in lower_text for k in expansion_keywords):
        signal_type = "expansion"
    elif any(k in lower_text for k in hiring_keywords):
        signal_type = "hiring_surge"

    # Extract headcount number
    headcount = None
    num_match = re.search(r'(\d{1,3}(?:,\d{3})+|\d+)\s*(?:employees|workers|roles|jobs|positions|staff|engineers|people)', text, re.IGNORECASE)
    if num_match:
        try:
            headcount_val = int(num_match.group(1).replace(",", ""))
            headcount = -headcount_val if signal_type in ["layoff", "restructuring"] else headcount_val
        except ValueError:
            pass

    # Extract company name candidates
    company_name = None
    known_companies = [
        "NVIDIA", "Google", "DeepMind", "Microsoft", "Amazon", "AWS", "Apple", "Meta",
        "ASML", "TSMC", "Intel", "AMD", "Tesla", "Stripe", "Databricks", "Spotify",
        "Netflix", "Salesforce", "Oracle", "Uber", "Lyft", "Airbnb", "Grab", "Atlassian",
        "Tata Consultancy Services", "TCS", "Infosys", "Wipro", "MercadoLibre", "Klarna",
        "BT Group", "General Motors", "Ford", "Novo Nordisk", "Armis Security", "Baidu"
    ]
    for comp in known_companies:
        if re.search(rf'\b{re.escape(comp)}\b', text, re.IGNORECASE):
            company_name = comp
            break

    if not company_name:
        # Fallback: find first capitalized consecutive proper noun
        words = text.split()
        for i in range(min(5, len(words) - 1)):
            if words[i][0].isupper() and len(words[i]) > 2 and words[i] not in ["The", "A", "Breaking", "Exclusive", "Major"]:
                company_name = words[i]
                break

    # Extract Location
    city = None
    country = None
    latitude = None
    longitude = None

    for loc_key, (lat, lon, ctry) in GEO_COORDINATES.items():
        if re.search(rf'\b{re.escape(loc_key)}\b', lower_text):
            city = loc_key.title()
            country = ctry
            latitude = lat
            longitude = lon
            break

    # Fallback coordinates if no match
    if not latitude:
        latitude = 37.7749
        longitude = -122.4194
        city = "Global"
        country = "International"

    title = text.split(".")[0].strip()
    if len(title) > 200:
        title = title[:197] + "..."

    return SignalCreate(
        title=title or "Extracted Corporate Employment Signal",
        summary=text if len(text) <= 500 else text[:497] + "...",
        source_url=source_url,
        source_name=source_name or "AI Signal Ingestion",
        signal_type=signal_type,
        confidence_score=0.92,
        country=country,
        city=city,
        latitude=latitude,
        longitude=longitude,
        company_name=company_name or "Corporate Enterprise",
        impact_headcount=headcount or (1000 if signal_type != "layoff" else -500),
        published_at=datetime.utcnow()
    )


async def extract_signal_with_gemini(text: str, source_url: Optional[str] = None, source_name: Optional[str] = None) -> Tuple[SignalCreate, str]:
    """Extract structured employment signal using Gemini API with intelligent fallback."""
    api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")

    if not api_key or api_key == "your_gemini_api_key_here":
        # Heuristic extraction
        signal = heuristic_extract_signal(text, source_url, source_name)
        analysis = (
            f"Parsed using CareerSignal Heuristic Engine (Gemini API key not configured). "
            f"Classified as '{signal.signal_type}' with estimated headcount {signal.impact_headcount}."
        )
        return signal, analysis

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)
        prompt = f"""
You are an expert labor economics analyst. Extract structured employment intelligence from this news snippet:
---
{text}
---

Return strict JSON adhering to this schema:
{{
  "title": "Concise summary title (max 200 chars)",
  "summary": "1-2 sentence executive briefing",
  "company_name": "Primary company name",
  "signal_type": "one of: hiring_surge, layoff, expansion, restructuring",
  "impact_headcount": integer (positive for hires, negative for layoffs/cuts),
  "city": "Metro or city name",
  "country": "Country name",
  "latitude": float latitude coordinate,
  "longitude": float longitude coordinate,
  "confidence_score": float between 0.0 and 1.0,
  "analysis_reasoning": "Brief explanation of how the signal was classified"
}}
"""
        response = client.models.generate_content(
            model="gemini-3.8-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        data = json.loads(response.text)
        signal = SignalCreate(
            title=data.get("title", text[:100]),
            summary=data.get("summary", text[:300]),
            source_url=source_url,
            source_name=source_name or "Gemini AI Ingestion",
            signal_type=data.get("signal_type", "hiring_surge"),
            confidence_score=float(data.get("confidence_score", 0.95)),
            country=data.get("country"),
            city=data.get("city"),
            latitude=float(data["latitude"]) if "latitude" in data and data["latitude"] else 37.7749,
            longitude=float(data["longitude"]) if "longitude" in data and data["longitude"] else -122.4194,
            company_name=data.get("company_name"),
            impact_headcount=data.get("impact_headcount"),
            published_at=datetime.utcnow()
        )
        reasoning = data.get("analysis_reasoning", "Extracted via Gemini 3.8 Flash model.")
        return signal, reasoning

    except Exception as e:
        logger.warning(f"Gemini API extraction failed, using heuristic fallback: {e}")
        signal = heuristic_extract_signal(text, source_url, source_name)
        analysis = f"Fallback extraction applied. Note: Gemini extraction encountered: {str(e)}"
        return signal, analysis
