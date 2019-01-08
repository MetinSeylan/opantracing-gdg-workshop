import {Get, Controller, Res, Req} from '@nestjs/common';
import {OrderService} from "./order/orderService";
import {ZipkinConfiguration} from "./configurations/zipkinConfiguration";

@Controller()
export class AppController {

    constructor(private readonly orderService: OrderService, private readonly zipkinConfiguration : ZipkinConfiguration) {}

    @Get("/getAllOrders")
    getOrders(@Res() res, @Req() req): Promise<void> {
        if(req.traceId){
            this.zipkinConfiguration.getTracer().setId(req.traceId);
        }

        return this.orderService.retrieveOrders().then(result => res.json(result));
    }
}
