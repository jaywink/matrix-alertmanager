#!/usr/bin/env bash

docker login
docker build -t jaywink/matrix-alertmanager .
docker push jaywink/matrix-alertmanager:latest
