// Nest JS
import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtUserService } from './services/jwt-user.service';

// Services

@Module({
  imports: [NestJwtModule.register({})],
  providers: [JwtUserService],
  exports: [JwtUserService],
})
export class JwtModule {}
