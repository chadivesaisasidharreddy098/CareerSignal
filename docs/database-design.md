# CareerSignal Database Design

## 1. Relational Schema Architecture

CareerSignal utilizes **PostgreSQL 16** with the **pgvector** extension for semantic signal clustering and geospatial querying.

---

## 2. Core Tables

### `signals` Table
Stores extracted job-market and corporate hiring intelligence signals.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGSERIAL` | PRIMARY KEY | Unique signal record identifier |
| `title` | `VARCHAR(255)` | NOT NULL, INDEX | Headline or news summary title |
| `summary` | `TEXT` | NULLABLE | Synthesized summary of the signal |
| `source_url` | `VARCHAR(1024)` | NULLABLE | Canonical source link |
| `source_name` | `VARCHAR(128)` | NOT NULL | News agency, aggregator, or WARN filing body |
| `signal_type` | `VARCHAR(64)` | NOT NULL, INDEX | Type: `hiring_surge`, `layoff`, `expansion`, etc. |
| `confidence_score`| `DOUBLE PRECISION` | DEFAULT 1.0 | AI classification certainty score (0.0 - 1.0) |
| `country` | `VARCHAR(100)` | INDEX, NULLABLE | Country of signal occurrence |
| `city` | `VARCHAR(100)` | NULLABLE | City / Metro region |
| `latitude` | `DOUBLE PRECISION` | INDEX, NULLABLE | Geographic latitude for map visualization |
| `longitude` | `DOUBLE PRECISION` | INDEX, NULLABLE | Geographic longitude for map visualization |
| `company_name` | `VARCHAR(150)` | INDEX, NULLABLE | Extracted company or organization name |
| `impact_headcount`| `INTEGER` | NULLABLE | Number of employees affected or planned hires |
| `is_verified` | `BOOLEAN` | DEFAULT FALSE | Moderation or cross-source confirmation status |
| `embedding` | `vector(1536)` | NULLABLE, INDEX | Vector embedding for semantic similarity search |
| `published_at` | `TIMESTAMPTZ` | NOT NULL, INDEX | Original news publication date |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | System ingestion timestamp |

---

## 3. Indexes & Optimization Strategy

1. **Geospatial & Bounding Box Queries**: Composite index on `(latitude, longitude)` or PostGIS geography point indexing for map bounds queries.
2. **Time-series Filter**: Composite index on `(published_at DESC, signal_type)` for feed retrieval.
3. **Vector Similarity Index**: HNSW index on `embedding vector_cosine_ops` for deduplication and related-signal clustering.
