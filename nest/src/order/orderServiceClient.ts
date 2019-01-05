import { Injectable } from '@nestjs/common';
import {ZipkinConfiguration} from "../configurations/zipkinConfiguration";

@Injectable()
export class OrderServiceClient {

    private readonly baseUrl: string = "http://localhost:1923";
    private readonly serviceName: string = "order-service";


    constructor(private readonly zipkinConfiguration: ZipkinConfiguration) {

    }

    async retrieveOrders(): Promise<Object> {

        const client = this.zipkinConfiguration.getClient(this.serviceName);

        console.log('before', this.zipkinConfiguration.getTracer().id.toString());

        // @ts-ignore
        const response = await client.get(this.baseUrl);

        return response.data;
    }

}
