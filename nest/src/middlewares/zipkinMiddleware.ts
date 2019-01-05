import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import {ZipkinConfiguration} from "../configurations/zipkinConfiguration";


@Injectable()
export class ZipkinMiddleware implements NestMiddleware {

    constructor(private readonly zipkinConfiguration : ZipkinConfiguration){}

    resolve(...args: any[]): MiddlewareFunction {
        return this.zipkinConfiguration.getMiddleware();
    }
}