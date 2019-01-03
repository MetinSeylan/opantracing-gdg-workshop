import { Injectable } from '@nestjs/common';
import {ZipkinConfiguration} from "../configurations/zipkinConfiguration";
import Request from 'request';

@Injectable()
export class OrderServiceClient {

    private readonly baseUrl: string = "http://localhost:1923";
    private readonly serviceName: string = "order-service";

    private readonly client: Request;

    constructor(private readonly zipkinConfiguration: ZipkinConfiguration) {
        this.client = this.zipkinConfiguration.makeServiceClient(this.serviceName);
    }

    async retrieveOrders(): Promise<Object> {
        const response = await this.client.get(this.baseUrl);

        return JSON.parse(response);
    }

}
