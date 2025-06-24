import { Injectable, UnauthorizedException} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService, 
        private jwtService: JwtService
    ) {}

    async signIn(username: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user?.username !== username) {
            throw new UnauthorizedException();
        }
        const { password, ...result } = user;
        // TODO: Generate a JWT and return it here
        // instead of the user object
        // return result;
        const payload = { sub: result.userId, username: result.username };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
