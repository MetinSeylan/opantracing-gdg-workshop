import {Injectable, MiddlewareFunction, NestMiddleware} from '@nestjs/common';
import {ZipkinConfiguration} from "../configurations/zipkinConfiguration";
import {option, TraceId} from "zipkin";


@Injectable()
export class ZipkinContextMiddleware implements NestMiddleware {

    constructor(private readonly zipkinConfiguration : ZipkinConfiguration){}

    resolve(...args: any[]): MiddlewareFunction {
        return (req, res, next) => {

            if(req.headers['x-b3-traceid']){
                req.traceId = new TraceId({
                    traceId: new option.Some(req.headers["x-b3-traceid"]),
                    spanId: req.headers["x-b3-spanid"],
                    sampled: new option.Some(req.headers["x-b3-sampled"]),
                });
            }

            this.zipkinConfiguration.getTracer().setId(req.traceId);

            next();

        }
    }
}