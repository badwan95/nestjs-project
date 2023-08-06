import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthDto} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(
    @Body() dto: AuthDto,
    // @Headers('authorization') basicAuthToken: string,
  ): any {
    return this.authService.signin(dto);
  }
  @Post('signup')
  signup(@Body() dto: AuthDto): any {
    return this.authService.signup(dto);
  }
}
