/**
 * GDG Cloud Istanbul
 * Zipkin & Jaeger on Nodejs Workshop
 */
const Express = require('express');
const {Tracer, ExplicitContext, BatchRecorder, JSON_V1, ConsoleRecorder} = require('zipkin');
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
const {HttpLogger} = require('zipkin-transport-http');

// Constants
const port = 1924;
const localServiceName = 'order-driver-service';
const drivers = require("./drivers.json");
const jaegerSpanUrl = "http://localhost:9411/api/v1/spans";

// Boot Up!
const app = Express();
const ctxImpl = new ExplicitContext();

const recorder = new BatchRecorder({
    logger: new HttpLogger({
        endpoint: jaegerSpanUrl,
        jsonEncoder: JSON_V1
    })
});
const tracer = new Tracer({ctxImpl, recorder, localServiceName});


// Apply Middleware
app.use(zipkinMiddleware({tracer, port}));

// Endpoints
app.get('/drivers', (req, res) => {
    // Create Local Span
    res.json(drivers);
});

app.listen(port, () => console.log(`${localServiceName} listening on port ${port}!`));
