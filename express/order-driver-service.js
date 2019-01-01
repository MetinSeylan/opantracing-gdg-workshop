/**
 * GDG Cloud Istanbul
 * Zipkin & Jaeger on Nodejs Workshop
 */
const Express = require('express');
const {Tracer, ExplicitContext, ConsoleRecorder} = require('zipkin');
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;

// Constants
const port = 1924;
const localServiceName = 'order-driver-service';
const drivers = require("./drivers.json");

// Boot Up!
const app = Express();
const ctxImpl = new ExplicitContext();
const recorder = new ConsoleRecorder();
const tracer = new Tracer({ctxImpl, recorder, localServiceName});


// Apply Middleware
app.use(zipkinMiddleware({tracer}));

// Endpoints
app.get('/drivers', (req, res) => {
    // Create Local Span
    tracer.local('retrieve-drivers', () => {

        res.json(drivers);

    });
});

app.listen(port, () => console.log(`${localServiceName} listening on port ${port}!`));
