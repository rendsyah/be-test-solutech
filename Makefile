# ====================================================
# Docker Compose Commands
# ====================================================

COMPOSE_FILE = docker-compose.yml
PROJECT_NAME = nextjs-app

# Deploy: Pull latest image from registry and start containers
.PHONY: deploy
deploy:
	@echo "Authenticating to container registry..."
	@echo "$(REGISTRY_PASSWORD)" | docker login $(REGISTRY_HOST) -u "$(REGISTRY_USER)" --password-stdin
	@echo "Pulling image (tag: $(IMAGE_TAG))..."
	@IMAGE_TAG=$(IMAGE_TAG) REGISTRY_HOST=$(REGISTRY_HOST) docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) pull
	@echo "Deploying containers..."
	@IMAGE_TAG=$(IMAGE_TAG) REGISTRY_HOST=$(REGISTRY_HOST) docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) up -d --force-recreate --no-build
	@echo "Cleaning up unused images..."
	@docker image prune -af
	@echo "Logging out from registry..."
	@docker logout $(REGISTRY_HOST)
	@echo "Deployment complete!"

# Restart: Restart running containers without pulling
.PHONY: restart
restart:
	@echo "Restarting containers..."
	@docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) restart
	@echo "Restart complete!"

# ====================================================
# Database Commands
# ====================================================

# Start PostgreSQL container for local development
.PHONY: db-up
db-up:
	@echo "Starting database container..."
	@docker compose -f $(COMPOSE_FILE) up -d db
	@echo "Database is ready!"

# Stop PostgreSQL container
.PHONY: db-down
db-down:
	@echo "Stopping database container..."
	@docker compose -f $(COMPOSE_FILE) down db
	@echo "Database stopped!"

# Generate Prisma Client
.PHONY: db-generate
db-generate:
	@echo "Generating Prisma Client..."
	@pnpm db:generate

# Apply migrations (dev)
.PHONY: db-migrate
db-migrate:
	@echo "Applying migrations..."
	@pnpm db:migrate

# Apply migrations (production)
.PHONY: db-deploy
db-deploy:
	@echo "Deploying migrations..."
	@pnpm db:deploy

# Run database seed
.PHONY: db-seed
db-seed:
	@echo "Seeding database..."
	@pnpm db:seed
