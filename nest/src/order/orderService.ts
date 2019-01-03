import { Injectable } from '@nestjs/common';
import {OrderServiceClient} from "./orderServiceClient";

@Injectable()
export class OrderService {

    constructor(private readonly orderServiceClient: OrderServiceClient) {}

    retrieveOrders(): Promise<Object> {
        return this.orderServiceClient.retrieveOrders();
    }

}
