import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {PrismaModule} from './prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({isGlobal: true})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
