"""Comprehensive tests for CareerSignal FastAPI backend endpoints."""

import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app
from app.database import init_db


@pytest.mark.asyncio
async def test_health_and_ping():
    await init_db()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        health_res = await client.get("/health")
        assert health_res.status_code == 200
        assert health_res.json()["status"] == "healthy"

        ping_res = await client.get("/api/v1/ping")
        assert ping_res.status_code == 200
        assert ping_res.json()["message"] == "pong"


@pytest.mark.asyncio
async def test_signals_crud_and_seed():
    await init_db()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Seed test
        seed_res = await client.post("/api/v1/signals/seed")
        assert seed_res.status_code == 200

        # List signals test
        list_res = await client.get("/api/v1/signals")
        assert list_res.status_code == 200
        data = list_res.json()
        assert "items" in data
        assert "total" in data
        assert len(data["items"]) > 0

        # Filter by signal_type test
        filtered_res = await client.get("/api/v1/signals?signal_type=hiring_surge")
        assert filtered_res.status_code == 200
        for item in filtered_res.json()["items"]:
            assert item["signal_type"] == "hiring_surge"

        # Search query test
        search_res = await client.get("/api/v1/signals?search=NVIDIA")
        assert search_res.status_code == 200
        items = search_res.json()["items"]
        if items:
            assert "NVIDIA" in items[0]["company_name"]


@pytest.mark.asyncio
async def test_map_geojson_endpoint():
    await init_db()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        map_res = await client.get("/api/v1/signals/map")
        assert map_res.status_code == 200
        geojson = map_res.json()
        assert geojson["type"] == "FeatureCollection"
        assert "features" in geojson
        if len(geojson["features"]) > 0:
            first = geojson["features"][0]
            assert first["type"] == "Feature"
            assert first["geometry"]["type"] == "Point"
            assert len(first["geometry"]["coordinates"]) == 2


@pytest.mark.asyncio
async def test_stats_endpoint():
    await init_db()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        stats_res = await client.get("/api/v1/signals/stats")
        assert stats_res.status_code == 200
        stats = stats_res.json()
        assert "total_signals" in stats
        assert "total_hiring_headcount" in stats
        assert "total_layoff_headcount" in stats
        assert "net_headcount" in stats
        assert "top_companies" in stats


@pytest.mark.asyncio
async def test_ai_extraction_endpoint():
    await init_db()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        extract_res = await client.post(
            "/api/v1/signals/extract",
            json={
                "text": "Stripe is expanding operations in Dublin adding 1,000 fintech roles over 2 years.",
                "source_url": "https://example.com/stripe",
            },
        )
        assert extract_res.status_code == 200
        body = extract_res.json()
        assert body["success"] is True
        assert body["extracted_signal"] is not None
        assert body["extracted_signal"]["signal_type"] in ["hiring_surge", "expansion"]
