import {Injectable} from '@nestjs/common';
import {Tracer, ExplicitContext, BatchRecorder} from 'zipkin';
import {HttpLogger} from "zipkin-transport-http";
import * as zipkin from "zipkin";
import JSON_V1 = zipkin.jsonEncoder.JSON_V1;
const wrapAxios = require('zipkin-instrumentation-axios');
import {expressMiddleware} from "zipkin-instrumentation-express";
import Axios, {AxiosStatic} from 'axios';
const CLSContext = require('zipkin-context-cls');

@Injectable()
export class ZipkinConfiguration {

    private readonly localServiceName: string = "gateway-service";
    private readonly jaegerSpanUrl: string = "http://localhost:9411/api/v1/spans";

    private readonly tracer: Tracer;

    constructor() {
        const ctxImpl = new CLSContext();
        this.tracer = new Tracer({ctxImpl, recorder: this.getRecorder(), localServiceName: this.localServiceName});
    }

    public getMiddleware(){
        return expressMiddleware({tracer: this.tracer});
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

    public getClient(remoteServiceName: string): AxiosStatic {
        return wrapAxios(Axios, { tracer: this.tracer, serviceName: remoteServiceName});
    }

}
