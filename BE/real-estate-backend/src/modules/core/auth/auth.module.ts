// Nest JS
import { Module } from '@nestjs/common';

// Services
import { AuthService } from './service/user.auth.service';

// Controllers
import { UserAuthController } from './controller/user-auth.controller';

// Strategies
import { JwtUserStrategy } from './strategy/user.strategy';

// Modules
import { JwtModule } from '../jwt/jwt.module';
import { UserModule } from 'src/modules/feature/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/feature/user/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule,
    UserModule,
  ],

  controllers: [UserAuthController],
  providers: [JwtUserStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
