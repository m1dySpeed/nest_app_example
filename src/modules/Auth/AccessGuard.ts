import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { verify } from 'jsonwebtoken';
import { env } from '../../utils/env';
import { ROOT_COLLECTION, RootSchema } from '../Storage/shemas/Root.schema';

@Injectable()
export class Guard implements CanActivate {
  private Root;
  constructor(@InjectConnection() private db: Connection) {
    this.Root = this.db.model(ROOT_COLLECTION, RootSchema);
  }

  async bearer(header): Promise<boolean> {
    try {
      const token = verify(header, env.JWT_SECRET);

      const account = await this.Root.findOne({
        username: token.user,
        role: token.role,
      });

      if (!account) throw new ForbiddenException('Bad access token');

      return true;
    } catch (error) {
      throw new ForbiddenException('Bad access token');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request?.headers?.authorization;

    if (!authorization) throw new ForbiddenException('Bad access token');

    const [tokenType, token] = authorization.split(' ');
    switch (tokenType) {
      case 'Bearer':
        return await this.bearer(token);
      default:
        return await this.bearer(token);
    }
  }
}

export const AccessGuard = function () {
  return applyDecorators(UseGuards(Guard));
};
