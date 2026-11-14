"""SQLAlchemy ORM models representing entities in the CareerSignal platform."""

from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, DateTime, Float, Integer, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class SignalItem(Base):
    """Represents an extracted career or hiring intelligence signal."""

    __tablename__ = "signals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    source_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    source_name: Mapped[str] = mapped_column(String(128), default="News Intelligence")

    # Signal Categorization: 'hiring_surge', 'layoff', 'expansion', 'restructuring', 'remote_policy'
    signal_type: Mapped[str] = mapped_column(String(64), index=True)
    confidence_score: Mapped[float] = mapped_column(Float, default=1.0)

    # Geographic data for global hiring map
    country: Mapped[Optional[str]] = mapped_column(String(100), index=True, nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    company_name: Mapped[Optional[str]] = mapped_column(String(150), index=True, nullable=True)
    impact_headcount: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    published_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
