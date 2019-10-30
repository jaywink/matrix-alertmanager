#!/usr/bin/env bash

set -e

if [[ -z "$1" ]]; then
    tag=latest
else
    tag=$1
fi

docker login
docker build -t jaywink/matrix-alertmanager:${tag} .
docker push jaywink/matrix-alertmanager:${tag}

if [[ "$tag" == "latest" ]]; then
    exit
fi

docker tag jaywink/matrix-alertmanager:${tag} jaywink/matrix-alertmanager:latest
docker push jaywink/matrix-alertmanager:latest
