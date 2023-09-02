test:
	docker run -it --rm \
		--workdir /app \
		-v $(PWD):/app \
		--userns host \
		node:18-alpine \
		sh -c "npm install && npm run test"
