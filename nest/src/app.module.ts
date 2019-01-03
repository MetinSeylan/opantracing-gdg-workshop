import {MiddlewareConsumer, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { OrderService } from './order/orderService';
import {ZipkinConfiguration} from "./configurations/zipkinConfiguration";
import {OrderServiceClient} from "./order/orderServiceClient";
import {ZipkinMiddleware} from "./middlewares/zipkinMiddleware";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [OrderService, OrderServiceClient, ZipkinConfiguration],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ZipkinMiddleware)
            .forRoutes(AppController);
    }
}