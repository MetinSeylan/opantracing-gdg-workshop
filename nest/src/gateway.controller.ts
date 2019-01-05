import {Controller, Body, Post, Res, Req, HttpCode} from '@nestjs/common';
import Axios from 'axios';

@Controller()
export class GatewayController {

    private readonly collectorUrl: string = "http://localhost:9411/api/v1/spans";

    @Post("/frontendProxy")
    @HttpCode(202)
    getOrders(@Body() body, @Req() req): void {
        Axios.post(this.collectorUrl, body, {
            headers: req.headers
        });
    }
}
