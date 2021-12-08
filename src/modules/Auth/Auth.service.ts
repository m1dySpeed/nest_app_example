import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { AuthLogInBody } from './dto/AuthLogIn.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {
  ROOT_COLLECTION,
  RootDocument,
  RootSchema,
} from '../Storage/shemas/Root.schema';
import { hash } from '../../utils/hash';
import { env } from '../../utils/env';

export enum AuthServiceError {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}

@Injectable()
export class AuthService {
  private Root: Model<RootDocument>;
  constructor(@InjectConnection() private db: Connection) {
    this.Root = this.db.model(ROOT_COLLECTION, RootSchema);
  }

  async authCheck(token) {
    const bearer = token.split(' ')[1];
    try {
      const validation = verify(bearer, env.JWT_SECRET);

      const root = await this.Root.findOne({
        username: validation.user,
        role: validation.role,
      });

      if (!root) return { session: false };
      else return { session: true };
    } catch (error) {
      return { session: false };
    }
  }

  async login(body: AuthLogInBody, response) {
    const user = await this.Root.findOne({
      username: body.username,
      password: hash(body.password),
    });

    if (!user) throw AuthServiceError.USER_NOT_FOUND;

    const token = sign(
      { user: user.username, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '15m' },
    );

    response.set('Authorization', `Bearer ${token}`);

    return { accessToken: token };
  }
}
