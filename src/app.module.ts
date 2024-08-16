import { Module } from '@nestjs/common';
import { CoreModule } from './modules/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './token/modules/auth/auth.service';
import { UserModule } from './mmodules/user/user.module';

@Module({
  imports: [CoreModule, AuthModule, UserModule],
  providers: [AuthService],
})
export class AppModule {}
