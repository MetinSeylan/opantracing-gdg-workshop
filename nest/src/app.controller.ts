import {Get, Controller, Res} from '@nestjs/common';
import {OrderService} from "./order/orderService";

@Controller()
export class AppController {

    constructor(private readonly orderService: OrderService) {
    }

    @Get()
    root(@Res() res): void {
        this.orderService.retrieveOrders().then(result => res.json(result));
    }
}
