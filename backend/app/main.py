"""FastAPI application entrypoint for CareerSignal API."""

import logging
from contextlib import asynccontextmanager
from datetime import datetime
from typing import List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, func

from app.config import get_settings
from app.database import init_db, async_session_maker
from app.models import SignalItem
from app.schemas import HealthResponse
from app.services.seed_data import SAMPLE_SIGNALS
from app.api.v1.router import api_router

logger = logging.getLogger("careersignal")
settings = get_settings()


class ConnectionManager:
    """Manages active WebSocket connections for live intelligence streaming."""
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection)


ws_manager = ConnectionManager()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: initialize database and auto-seed if empty."""
    try:
        await init_db()
        # Auto-seed if empty
        async with async_session_maker() as session:
            count_res = await session.execute(select(func.count(SignalItem.id)))
            count = count_res.scalar_one()
            if count == 0:
                for s in SAMPLE_SIGNALS:
                    session.add(SignalItem(**s))
                await session.commit()
                logger.info(f"Initialized database with {len(SAMPLE_SIGNALS)} sample signals.")
    except Exception as e:
        logger.warning(f"Database initialization notice: {e}")
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered national and international job-news intelligence platform API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS setup for web and mobile clients
origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["System"])
async def root():
    """Root metadata endpoint with direct links to docs and signals."""
    return {
        "service": settings.APP_NAME,
        "status": "online",
        "documentation": "/docs",
        "signals_endpoint": f"{settings.API_V1_PREFIX}/signals",
        "jobs_endpoint": f"{settings.API_V1_PREFIX}/jobs",
        "map_endpoint": f"{settings.API_V1_PREFIX}/signals/map",
        "stats_endpoint": f"{settings.API_V1_PREFIX}/signals/stats",
    }


@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check() -> HealthResponse:
    """Service health inspection endpoint."""
    return HealthResponse(
        status="healthy",
        service=settings.APP_NAME,
        timestamp=datetime.utcnow(),
    )


@app.get(f"{settings.API_V1_PREFIX}/ping", tags=["System"])
async def ping():
    """Lightweight connectivity ping."""
    return {"message": "pong", "service": settings.APP_NAME}


@app.websocket("/ws/signals")
async def websocket_signals_feed(websocket: WebSocket):
    """WebSocket stream for real-time signal broadcasts."""
    await ws_manager.connect(websocket)
    try:
        # Send initial welcome frame
        await websocket.send_json({
            "type": "CONNECTION_ESTABLISHED",
            "message": "Connected to CareerSignal real-time intelligence network.",
            "timestamp": datetime.utcnow().isoformat(),
        })
        while True:
            data = await websocket.receive_text()
            # Client heartbeats or queries
            await websocket.send_json({
                "type": "HEARTBEAT_ACK",
                "received": data,
                "timestamp": datetime.utcnow().isoformat(),
            })
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
