test:
	docker run -it --rm \
		--workdir /app \
		-v $(PWD):/app \
		-e LOG_LEVEL=INFO \
		--userns host \
		node:18-alpine \
		sh -c "npm install && npm run test"

build:
	docker build -t matrix-alertmanager .
