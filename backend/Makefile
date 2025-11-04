# Makefile for D&D Character Creator Backend
# Task: T005 - Create Makefile

.PHONY: help build test lint run docker-build docker-run clean deps swagger

# Default target
help:
	@echo "D&D Character Creator Backend - Available targets:"
	@echo "  make build         - Build the application"
	@echo "  make test          - Run all tests"
	@echo "  make test-unit     - Run unit tests only"
	@echo "  make test-int      - Run integration tests only"
	@echo "  make lint          - Run golangci-lint"
	@echo "  make run           - Run the application locally"
	@echo "  make docker-build  - Build Docker image"
	@echo "  make docker-run    - Run Docker container"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make deps          - Download dependencies"
	@echo "  make swagger       - Generate Swagger documentation"
	@echo "  make fmt           - Format code with gofmt"

# Build the application
build:
	@echo "Building application..."
	go build -o bin/server cmd/server/main.go

# Run all tests
test:
	@echo "Running all tests..."
	go test -v -race -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html

# Run unit tests only
test-unit:
	@echo "Running unit tests..."
	go test -v -race -coverprofile=coverage-unit.out ./tests/unit/...

# Run integration tests only
test-int:
	@echo "Running integration tests..."
	go test -v -race -coverprofile=coverage-int.out ./tests/integration/...

# Run golangci-lint
lint:
	@echo "Running linters..."
	golangci-lint run --config .golangci.yml

# Format code
fmt:
	@echo "Formatting code..."
	gofmt -s -w .
	goimports -w .

# Run the application
run:
	@echo "Starting server..."
	go run cmd/server/main.go

# Build Docker image
docker-build:
	@echo "Building Docker image..."
	docker build -t dnd-character-creator-backend:latest .

# Run Docker container
docker-run:
	@echo "Running Docker container..."
	docker run -p 8080:8080 --env-file .env dnd-character-creator-backend:latest

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf bin/
	rm -f coverage.out coverage.html coverage-unit.out coverage-int.out
	go clean

# Download dependencies
deps:
	@echo "Downloading dependencies..."
	go mod download
	go mod verify

# Generate Swagger documentation
swagger:
	@echo "Generating Swagger documentation..."
	swag init -g cmd/server/main.go -o docs

# Install development tools
install-tools:
	@echo "Installing development tools..."
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	go install github.com/swaggo/swag/cmd/swag@latest
	go install golang.org/x/tools/cmd/goimports@latest

# Watch and rebuild on changes (requires air)
watch:
	@echo "Starting hot reload with air..."
	air
