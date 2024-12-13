import { Module } from '@nestjs/common'
import { WebsocketService } from './websocket.service'
import { WebsocketGateway } from './websocket.gateway'
import { MongooseModule } from '@nestjs/mongoose'
//import { StoreQueuedMessageSchema, StoreQueuedMessage } from './schemas/StoreQueuedMessage'
import { StoreQueuedMessage } from './schemas/StoreQueuedMessage'
import { StoreLiveSessionSchema, StoreLiveSession } from './schemas/StoreLiveSession'
import { MessagePersister } from './services/MessagePersister'
import { HttpModule } from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: StoreQueuedMessage.name, schema: StoreQueuedMessageSchema },
    //   { name: StoreLiveSession.name, schema: StoreLiveSessionSchema },
    // ]),
    TypeOrmModule.forFeature([StoreQueuedMessage]),
    HttpModule,
    ClientsModule.register([
      {
        name: 'NATS_SERVICE', // Unique token
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'], // Replace with your NATS server URL
        },
      },
    ]),
  ],
  providers: [WebsocketGateway, WebsocketService, MessagePersister, StoreQueuedMessage],
})
export class WebsocketModule {}
