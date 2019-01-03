import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import {ZipkinConfiguration} from "../configurations/zipkinConfiguration";
import {expressMiddleware} from "zipkin-instrumentation-express";

@Injectable()
export class ZipkinMiddleware implements NestMiddleware {

    constructor(private readonly zipkinConfiguration: ZipkinConfiguration){}

    resolve(...args: any[]): MiddlewareFunction {

        return expressMiddleware({
            tracer: this.zipkinConfiguration.getTracer(),
            port: 3000
        });

    }
}