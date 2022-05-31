#!/usr/bin/env sh

alembic upgrade head
uvicorn main:app --host 0.0.0.0 --reload
