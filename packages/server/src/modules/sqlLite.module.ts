import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'
import { StoreQueuedMessage } from '../websocket/schemas/StoreQueuedMessage'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService): Promise<SqliteConnectionOptions> => ({
        type: 'sqlite',      
        database: configService.get<string>('appConfig.sqlLiteDbUri'), // SQLite database file
        entities: [StoreQueuedMessage],
        synchronize: true, // Use this in development only; it auto-generates schema
      }),
      inject: [ConfigService],
      
    }),
    TypeOrmModule.forFeature([StoreQueuedMessage]),
  ],
  exports: [],
})
export class HandledSqlLiteModule {}
