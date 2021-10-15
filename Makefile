include .env

PROJECT = "StreamParticles Upload"

install: ;@echo "Installing ${PROJECT}";
	npm install

build : ;@echo "Building ${PROJECT}";
	docker build . -t upload;

start : ;@echo "Starting ${PROJECT}";
	docker run --rm -p $(API_PORT):$(API_PORT) upload npm run build && node dist/index.js

start:daemon : ;@echo "Starting ${PROJECT} in detached mode";
	docker run --rm -p $(API_PORT):$(API_PORT) upload npm run build && pm2 start ecosystem.config.js

dev : ;@echo "Starting  ${PROJECT} in dev mode";
	docker run --rm -p $(API_PORT):$(API_PORT) upload npm run dev

stop : ;@echo "Stopping ${PROJECT}";
	docker stop upload

clean : ;@echo "Cleaning ${PROJECT}";
	make stop 
	docker rm -f
	docker image prune -a -f