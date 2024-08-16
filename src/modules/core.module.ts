import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { DatabaseModule } from 'src/database/database.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { IntegrationsModule } from 'src/integrations/integrations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    IntegrationsModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    FileModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class CoreModule {}
