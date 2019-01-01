/**
 * GDG Cloud Istanbul
 * Zipkin & Jaeger on Nodejs Workshop
 */
const Express = require('express');
const {Tracer, ExplicitContext, ConsoleRecorder} = require('zipkin');
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
const wrapRequest = require('zipkin-instrumentation-request');
const request = require('request');

// Constants
const port = 1923;
const localServiceName = 'order-service';
const orders = require("./orders.json");

// Boot Up!
const app = Express();
const ctxImpl = new ExplicitContext();
const recorder = new ConsoleRecorder();
const tracer = new Tracer({ctxImpl, recorder, localServiceName});
const orderDriverClient = wrapRequest(request, {tracer, remoteServiceName: "order-driver-service"});

// Apply Middleware
app.use(zipkinMiddleware({tracer}));

// Endpoints
app.get('/', (req, res) => {
    // Create Local Span
    tracer.local('retrieve-orders', () => {

        orderDriverClient({
            url: 'http://localhost:1924/drivers',
            method: 'GET',
        }, (error, response, drivers) => {
            res.json({orders, drivers: JSON.parse(drivers)});
        });

    });
});

app.listen(port, () => console.log(`${localServiceName} listening on port ${port}!`));