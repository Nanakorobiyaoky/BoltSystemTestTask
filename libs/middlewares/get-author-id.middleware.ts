import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GetAuthorIdMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction): any {
    const auth = req.headers['authorization'];
    if (auth) {
      const [bearer, token] = auth.split(' ');
      if (bearer !== 'Bearer' || !token) {
        next();
      }
      const user = this.jwtService.verify(token);
      if (req.body) {
        req.body['authorId'] = user.id;
      }
    }
    next();
  }
}
