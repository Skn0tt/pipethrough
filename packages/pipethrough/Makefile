IMAGE_TAG ?= skn0tt/pipethrough:latest

build: src/**/*.ts package.json
	cd ../../ && \
	docker build \
		-t $(IMAGE_TAG) \
		-f packages/pipethrough/Dockerfile \
		.