SHELL := /bin/bash
include ../.env
export

env:
	npm install

run:
	@echo "Running service..."
	node --trace-deprecation app.js
test: env
	@echo "Running unit tests..."
