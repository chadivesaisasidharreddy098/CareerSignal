"""API v1 router registry."""

from fastapi import APIRouter
from app.api.v1.endpoints.signals import router as signals_router

api_router = APIRouter()
api_router.include_router(signals_router)
