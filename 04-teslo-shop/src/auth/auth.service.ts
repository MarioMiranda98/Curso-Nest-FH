import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { IJwtPayload } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);

      const u = await this.userRepository.save({ ...user, password: bcrypt.hashSync(createUserDto.password, 10) });

      const { password, ...result } = u;
      return { result, token: this.getJwtToken({ email: result.email, id: result.id }) };
    } catch (error) {
      this.handleError(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;

      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true }
      });

      if (!user) throw new UnauthorizedException("Not Valid Credentials");

      if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException("Not Valid Credentials")
      console.log(user);

      return { ...user, token: this.getJwtToken({ email: user.email, id: user.id }) };
    } catch (error) {
      this.handleError(error);
    }
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({
        email: user.email,
        id: user.id
      }),
    }
  }


  private getJwtToken(payload: IJwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }

  private handleError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
