"""Pydantic data schemas for request validation and response serialization."""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict, Field


class SignalBase(BaseModel):
    """Base schema for career and hiring signals."""
    title: str = Field(..., max_length=255, description="Headline or title of the intelligence signal")
    summary: Optional[str] = Field(None, description="Executive summary of the intelligence item")
    source_url: Optional[str] = Field(None, max_length=1024, description="Origin URL of the news signal")
    source_name: str = Field("News Intelligence", max_length=128)
    careers_url: Optional[str] = Field(None, max_length=1024, description="Verified corporate career portal URL")
    department: Optional[str] = Field(None, max_length=150)
    salary_range: Optional[str] = Field(None, max_length=100)
    experience_level: Optional[str] = Field(None, max_length=100)
    work_mode: Optional[str] = Field(None, max_length=100)
    open_roles: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    signal_type: str = Field(..., description="Classification (e.g., hiring_surge, layoff, expansion, restructuring)")
    confidence_score: float = Field(1.0, ge=0.0, le=1.0)
    country: Optional[str] = Field(None, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    company_name: Optional[str] = Field(None, max_length=150)
    impact_headcount: Optional[int] = Field(None, description="Estimated number of jobs added or affected")


class SignalCreate(SignalBase):
    """Schema for creating a new intelligence signal."""
    published_at: Optional[datetime] = None


class SignalResponse(SignalBase):
    """Response schema returning full signal details."""
    id: int
    is_verified: bool
    published_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SignalListResponse(BaseModel):
    """Paginated collection of signals."""
    total: int
    page: int
    page_size: int
    items: List[SignalResponse]


class GeoGeometry(BaseModel):
    type: str = "Point"
    coordinates: List[float] = Field(..., description="[longitude, latitude]")


class GeoProperties(BaseModel):
    signal_id: int
    company: Optional[str] = None
    signal_type: str
    impact_headcount: Optional[int] = None
    title: str
    country: Optional[str] = None
    city: Optional[str] = None
    careers_url: Optional[str] = None
    published_at: Optional[datetime] = None



class GeoFeature(BaseModel):
    type: str = "Feature"
    geometry: GeoGeometry
    properties: GeoProperties


class GeoFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoFeature]


class SignalStatsResponse(BaseModel):
    total_signals: int
    total_hiring_headcount: int
    total_layoff_headcount: int
    net_headcount: int
    by_type: Dict[str, int]
    top_companies: List[Dict[str, Any]]
    top_countries: List[Dict[str, Any]]


class AIExtractRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Raw news headline, article body, or press release text")
    source_url: Optional[str] = None
    source_name: Optional[str] = "Web Intelligence"


class AIExtractResponse(BaseModel):
    success: bool
    extracted_signal: Optional[SignalCreate] = None
    raw_analysis: Optional[str] = None
    message: Optional[str] = None


class HealthResponse(BaseModel):
    """Standard health check status schema."""
    status: str
    service: str
    timestamp: datetime
