/**
 * GDG Cloud Istanbul
 * Zipkin & Jaeger on Nodejs Workshop
 */
const Express = require('express');
const {Tracer, ExplicitContext, BatchRecorder, ConsoleRecorder, JSON_V1} = require('zipkin');
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
const wrapRequest = require('zipkin-instrumentation-request');
const request = require('request');
const {HttpLogger} = require('zipkin-transport-http');

// Constants
const port = 1923;
const localServiceName = 'order-service';
const orders = require("./orders.json");
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

const orderDriverClient = wrapRequest(request, {tracer, remoteServiceName: "order-driver-service"});

// Apply Middleware
app.use(zipkinMiddleware({tracer, port}));

// Endpoints
app.get('/', (req, res) => {

    orderDriverClient({
        url: 'http://localhost:1924/drivers',
        method: 'GET',
    }, (error, response, drivers) => {
        res.json({orders, drivers: JSON.parse(drivers)});
    });

});

app.listen(port, () => console.log(`${localServiceName} listening on port ${port}!`));
