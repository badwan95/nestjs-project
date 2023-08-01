import {ForbiddenException, Injectable} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {AuthDto} from './dto';
import * as argon from 'argon2';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // Generate the password hash
    const hash = await argon.hash(dto.password);
    // Save the new user in the DB
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        // You can select the fields manually
        // select: {
        //   id: true,
        //   email: true,
        //   created_at: true,
        // },
      });
      delete user.hash;
      // Return the saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken.');
        }
      }
      throw error;
    }
  }
  signin(): any {
    return {msg: 'I have signed up'};
  }
}
