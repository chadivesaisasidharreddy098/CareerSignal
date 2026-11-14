"""CareerSignal Backend Application Package.

Provides FastAPI routing, intelligence pipelines, database integration,
and configuration management for real-time hiring signal analysis.
"""

import os
# Ensure pure Python fallback for environments with DLL restrictions (e.g., Windows WDAC/AppLocker)
os.environ.setdefault("SQLALCHEMY_NO_EXTENSIONS", "1")
os.environ.setdefault("DISABLE_SQLALCHEMY_CEXT", "1")

__version__ = "0.1.0"
