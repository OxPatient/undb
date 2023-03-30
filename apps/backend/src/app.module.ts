import { createConfig } from '@egodb/sqlite'
import { MikroORM } from '@mikro-orm/core'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import type { OnModuleInit } from '@nestjs/common'
import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { ClsModule } from 'nestjs-cls'
import { LoggerModule } from 'nestjs-pino'
import { AttachmentModule } from './attachment/attachment.module.js'
import { BaseConfigService } from './configs/base-config.service.js'
import { ConfigModule } from './configs/config.module.js'
import { sqliteConfig } from './configs/sqlite.js'
import { HealthModule } from './health/health.module.js'
import { modules } from './modules/index.js'
import { TrpcModule } from './trpc/trpc.module.js'

@Module({
  imports: [
    ConfigModule,
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    HealthModule,
    TrpcModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: BaseConfigService) => ({
        pinoHttp: {
          transport: !config.isProd ? { target: 'pino-pretty' } : undefined,
        },
      }),
      inject: [BaseConfigService],
    }),
    MikroOrmModule.forRootAsync({
      useFactory: (config: ConfigType<typeof sqliteConfig>) => createConfig(config.data!, process.env.NODE_ENV),
      inject: [sqliteConfig.KEY],
    }),
    ...modules,
    AttachmentModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    await this.orm.getMigrator().up()
  }
}
