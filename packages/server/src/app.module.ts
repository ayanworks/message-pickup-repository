import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { WebsocketModule } from './websocket/websocket.module'
import { HandledRedisModule } from './modules/redis.module'
import { HandledMongooseModule } from './modules/mongo.module'
import appConfig from './config/app.config'
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreQueuedMessage } from './websocket/schemas/StoreQueuedMessage'
import { HandledSqlLiteModule } from './modules/sqlLite.module'

@Module({
  imports: [
    WebsocketModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [appConfig],
      isGlobal: true,
    }),
    //HandledMongooseModule,
    HandledSqlLiteModule,
    TypeOrmModule.forFeature([StoreQueuedMessage]),
    HandledRedisModule,
  ],
  controllers: [],
  providers: [
    //HandledMongooseModule, 
    HandledSqlLiteModule,
    HandledRedisModule, 
  ],
})
export class AppModule {}
