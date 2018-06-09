IMAGE_TAG ?= skn0tt/pipethrough:latest

build: src/**/*.ts package.json yarn.lock
	docker build \
		-t $(IMAGE_TAG) \
		.