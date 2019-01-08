const tracer = require('@google-cloud/trace-agent').start();

const express = require('express');
const got = require('got');

const app = express();
const DISCOVERY_URL = 'https://www.googleapis.com/discovery/v1/apis';

// This incoming HTTP request should be captured by Trace
app.get('/', async (req, res) => {

    tracer.runInRootSpan({ name: 'my-root-span' }, (rootSpan) => {

        console.log('deneme log');

        rootSpan.endSpan();
    });

    // This outgoing HTTP request should be captured by Trace
    try {
        const { body } = await got(DISCOVERY_URL, { json: true });
        const names = body.items.map((item) => item.name);
        res
            .status(200)
            .send(names.join('\n'))
            .end();
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .end();
    }
});

// Start the server
const PORT = process.env.PORT || 1923;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});