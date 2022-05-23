#!/usr/bin/env bash

VERSION=$(date +%m%d%y)

ACCOUNT_NAME=jac18281828
PROJECT_NAME=$(basename ${PWD})
PROJECT=${ACCOUNT_NAME}/${PROJECT_NAME}

docker build . -t ${PROJECT}:${VERSION} && \
	docker run --rm -i -t ${PROJECT}:${VERSION}
