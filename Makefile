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
	@docker image prune -f
	@echo "Logging out from registry..."
	@docker logout $(REGISTRY_HOST)
	@echo "Deployment complete!"

# Restart: Restart running containers without pulling
.PHONY: restart
restart:
	@echo "Restarting containers..."
	@docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) restart
	@echo "Restart complete!"
