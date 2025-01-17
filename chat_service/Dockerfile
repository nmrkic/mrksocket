ARG PYTHON_VERSION_UV=ghcr.io/astral-sh/uv:python3.13-bookworm-slim
ARG PYTHON_VERSION=python:3.13-slim-bookworm

# Stage 1
FROM ${PYTHON_VERSION_UV} AS builder
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy PYTHONUNBUFFERED=1

WORKDIR /opt/app

COPY ./uv.lock .
COPY ./pyproject.toml .

RUN uv sync --frozen --no-install-project --no-dev --no-editable --no-cache

COPY ./package/app /opt/app/package/app
COPY ./package/__init__.py /opt/app/package/__init__.py
COPY ./package/run.py /opt/app/package/run.py
COPY ./config /opt/app/config
COPY ./README.md /opt/app/README.md

RUN uv sync --frozen --no-dev --no-editable --no-cache

# Final stage
FROM ${PYTHON_VERSION} AS prod
ENV PYTHONUNBUFFERED=1
ARG APP_DIR

WORKDIR /opt/app

COPY --from=builder /opt/app/.venv .venv

COPY ./$APP_DIR/config/run.sh run.sh
RUN chmod +x /opt/app/run.sh

ENV PATH="/opt/app/.venv/bin:$PATH"

# Specify the command to run when the image is run.
CMD ["/opt/app/run.sh"]
