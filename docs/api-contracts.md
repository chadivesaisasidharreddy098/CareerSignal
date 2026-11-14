# CareerSignal API Contracts

Base URL: `/api/v1`

---

## 1. System Endpoints

### `GET /health`
Returns service availability and timestamp.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "CareerSignal API",
  "timestamp": "2026-10-17T14:10:00Z"
}
```

---

## 2. Intelligence Signals

### `GET /api/v1/signals`
Retrieve paginated hiring and workforce signals with optional filters.

**Query Parameters:**
- `page` (integer, default: 1)
- `page_size` (integer, default: 20, max: 100)
- `signal_type` (string, optional: `hiring_surge`, `layoff`, `expansion`, `restructuring`)
- `country` (string, optional)
- `company` (string, optional)
- `start_date` (ISO date, optional)
- `end_date` (ISO date, optional)

**Response (200 OK):**
```json
{
  "total": 142,
  "page": 1,
  "page_size": 20,
  "items": [
    {
      "id": 101,
      "title": "Major Tech Inc. Announces 1,500 Engineering Roles in Berlin",
      "summary": "Expansion of AI infrastructure campus resulting in significant local engineering recruitment.",
      "signal_type": "hiring_surge",
      "confidence_score": 0.96,
      "company_name": "Major Tech Inc.",
      "country": "Germany",
      "city": "Berlin",
      "latitude": 52.5200,
      "longitude": 13.4050,
      "impact_headcount": 1500,
      "source_name": "TechDispatch",
      "source_url": "https://example.com/news/berlin-expansion",
      "is_verified": true,
      "published_at": "2026-10-17T12:00:00Z",
      "created_at": "2026-10-17T12:05:00Z"
    }
  ]
}
```

---

### `GET /api/v1/signals/map`
Optimized geospatial endpoint returning signal clusters for interactive map rendering.

**Query Parameters:**
- `bbox` (string, bounding box `min_lon,min_lat,max_lon,max_lat`)
- `signal_type` (string, optional)
- `since_days` (integer, default: 30)

**Response (200 OK):**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [13.4050, 52.5200]
      },
      "properties": {
        "signal_id": 101,
        "company": "Major Tech Inc.",
        "signal_type": "hiring_surge",
        "impact_headcount": 1500,
        "title": "Major Tech Inc. Announces 1,500 Engineering Roles in Berlin"
      }
    }
  ]
}
```
