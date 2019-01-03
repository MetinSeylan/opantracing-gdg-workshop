import {Injectable} from '@nestjs/common';
import {Tracer, ExplicitContext, BatchRecorder} from 'zipkin';
import {HttpLogger} from "zipkin-transport-http";
import * as zipkin from "zipkin";
import JSON_V1 = zipkin.jsonEncoder.JSON_V1;
const RequestWrapper = require('zipkin-instrumentation-request');
const Request = require('request-promise-native');

@Injectable()
export class ZipkinConfiguration {

    private readonly localServiceName: string = "gateway-service";
    private readonly jaegerSpanUrl: string = "http://localhost:9411/api/v1/spans";

    private readonly tracer: Tracer;

    constructor() {
        const ctxImpl = new ExplicitContext();
        this.tracer = new Tracer({ctxImpl, recorder: this.getRecorder(), localServiceName: this.localServiceName});
    }

    private getRecorder(): BatchRecorder {
        return new BatchRecorder({
            logger: new HttpLogger({
                endpoint: this.jaegerSpanUrl,
                jsonEncoder: JSON_V1
            })
        });
    }

    public getTracer(): Tracer {
        return this.tracer;
    }

    public makeServiceClient(remoteServiceName: string): Request {
        return RequestWrapper(Request, {tracer: this.tracer, remoteServiceName});
    }

}
