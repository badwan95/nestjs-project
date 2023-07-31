import {Controller, Get, Post} from '@nestjs/common';
import {AuthService} from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(): any {
    return this.authService.signin();
  }
  @Post('singup')
  signup(): any {
    return this.authService.signup();
  }
}
