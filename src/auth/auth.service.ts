import {ForbiddenException, Injectable} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {AuthDto} from './dto';
import * as argon from 'argon2';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
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
      // Return the token
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken.');
        }
        throw error;
      }
      throw error;
    }
  }
  /**
   * Find user by email, if user does not exist, throw exception,
   * then compare password, if password is incorrect, throw exception, if all
   * goes well, send back the user.
   */
  async signin(dto: AuthDto) {
    try {
      // Find user by email
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      // If user does not exist, throw an exception (guard condition)
      if (!user) throw new ForbiddenException('Incorrect credentials');
      // Compare password
      const pwMatches = await argon.verify(user.hash, dto.password);
      if (!pwMatches) throw new ForbiddenException('Incorrect credentials');
      // If all is well, return JWT
      return this.signToken(user.id, user.email);
    } catch (error) {
      throw error;
    }
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{access_token: string}> {
    const secret = this.config.get('JWT_SECRET');
    const payload = {
      sub: userId,
      email,
    };
    const options = {
      expiresIn: '15m',
      secret,
    };
    const accessToken = await this.jwtService.signAsync(payload, options);
    return {
      access_token: accessToken,
    };
  }

  /**
   * Manual checking the basic authentication
   */
  // checkAuthenticationToken(token: string | undefined) {
  //   if (!token) throw new UnauthorizedException();
  //   if (token.includes('Basic')) {
  //     const tokenValue: string | undefined = token.split(' ')[1];
  //     if (tokenValue) {
  //       const [email, password] = Buffer.from(tokenValue, 'base64')
  //         .toString('utf8')
  //         .split(':');
  //       const dto: AuthDto = {
  //         email,
  //         password,
  //       };
  //       return dto;
  //     }
  //   }
  //   throw new UnauthorizedException();
  // }
}
