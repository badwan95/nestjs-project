import {Injectable} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signup(): any {
    return {msg: 'I have signed up'};
  }
  signin(): any {
    return {msg: 'I have signed up'};
  }
}
