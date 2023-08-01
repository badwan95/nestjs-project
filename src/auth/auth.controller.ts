import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthDto} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(): any {
    return this.authService.signin();
  }
  @Post('signup')
  signup(@Body() dto: AuthDto): any {
    console.log({dto});
    return this.authService.signup(dto);
  }
}
