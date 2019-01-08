`
kubectl run stackdriver-zipkin \
  --image=gcr.io/stackdriver-trace-docker/zipkin-collector:v0.2.0 \
  --expose --port=9411
`