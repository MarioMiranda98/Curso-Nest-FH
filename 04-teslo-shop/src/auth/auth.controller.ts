import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles.interface';
import { Auth } from './decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('/login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('/private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(@GetUser() user: User, @GetUser('email') userEmail: string, @RawHeaders() rawHeaders: string[]) {
    return { message: 'Hola Mundo Private', user: { ...user }, userEmail: userEmail, rawHeaders };
  }

  // @SetMetadata('roles', ['admin', 'super-user'])

  @Get('/private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateReoute2(@GetUser() user: User) {
    return {
      "ok": true,
      user,
    };
  }

  @Get('/private3')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  privateReoute3(@GetUser() user: User) {
    return {
      "ok": true,
      user,
    };
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User,
  ) {
    return this.authService.checkAuthStatus(user);
  }
}
