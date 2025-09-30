import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from 'src/modules/feature/user/schema/user.schema';
import { JWT } from 'src/types/common.type';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt_user') {
  constructor(
    configService: ConfigService,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {
    const userSecret = configService.get<string>('auth.userSecret');
    if (!userSecret) {
      throw new Error('User secret is not defined in configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: userSecret, // Make sure it's a string or buffer and not undefined
      ignoreExpiration: false,
    });
  }

  async validate({ id }: JWT): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id).exec();

      if (!user) {
        Logger.error('Invalid token');
        throw new UnauthorizedException('Invalid token');
      }

      return user;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        Logger.error('Token expired');
        throw new UnauthorizedException('Token expired');
      } else {
        throw error;
      }
    }
  }
}
