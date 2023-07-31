import {Injectable} from '@nestjs/common';

@Injectable()
export class AuthService {
  signup(): any {
    return {msg: 'I have signed up'};
  }
  signin(): any {
    return {msg: 'I have signed up'};
  }
}
