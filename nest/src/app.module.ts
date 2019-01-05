import {MiddlewareConsumer, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {OrderService} from './order/orderService';
import {ZipkinConfiguration} from "./configurations/zipkinConfiguration";
import {OrderServiceClient} from "./order/orderServiceClient";
import {ZipkinMiddleware} from "./middlewares/zipkinMiddleware";
import {GatewayController} from "./gateway.controller";
import {ZipkinContextMiddleware} from "./middlewares/zipkinContextMiddleware";

@Module({
    imports: [],
    controllers: [AppController, GatewayController],
    providers: [OrderService, OrderServiceClient, ZipkinConfiguration],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ZipkinMiddleware, ZipkinContextMiddleware)
            .forRoutes(AppController);
    }
}