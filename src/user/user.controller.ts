import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PasswordService } from 'src/auth/password.service';
import { ResponseType } from 'src/utils';
import { UserFindParams, UserUpdateParams } from './dto';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(
    private userService: UserService,
    private passwordService: PasswordService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('me')
  @UseGuards(JwtAccessAuthGuard)
  async getUserInfo(@Req() req): Promise<ResponseType> {
    try {
      const info = await this.userService.findOneById(req.user.userId);
      delete info.hash;
      delete info.hashedRT;
      return {
        success: true,
        message: 'Info found',
        data: info,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: "Error'd",
        data: e,
      };
    }
  }

  /**
   * handle /api/user/find route
   * @param query find params.
   * @returns List of users found. Pioritize people who are friends with current user.
   */
  @HttpCode(HttpStatus.OK)
  @Get('find')
  @UseGuards(JwtAccessAuthGuard)
  async findUser(@Query() query: UserFindParams): Promise<ResponseType> {
    try {
      const users = await this.userService.findUser(query);
      return {
        success: true,
        message: 'Users Found!',
        data: users,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: 'Errors had occured',
        data: e,
      };
    }
  }

  /**
   * Used in usecases where users modify their info, namely 'name', 'password', 'image url'
   * @param body Data used for update.
   * @param req Request object contains data of current user
   * @returns result.
   */
  @HttpCode(HttpStatus.OK)
  @Post('update')
  @UseGuards(JwtAccessAuthGuard)
  async updateUser(
    @Body() body: UserUpdateParams,
    @Req() req,
  ): Promise<ResponseType> {
    try {
      const userId = req.user.userId;
      const hash = await this.passwordService.hash(body.password);
      const data = await this.userService.updateUser({
        id: userId,
        email: body.email,
        hash: hash,
        name: body.name,
        profilePicURL: body.profilePicURL,
        hashedRT: undefined,
      });
      return {
        success: true,
        message: 'Updated',
        data: data,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: 'Fail to update user',
        data: e,
      };
    }
  }

  /**
   * Delete current user. Used for user delete account usecase;
   * @param req request object
   * @returns success or not. Might throw some error.
   */
  @HttpCode(HttpStatus.OK)
  @Delete('')
  @UseGuards(JwtAccessAuthGuard)
  async deleteUser(@Req() req): Promise<ResponseType> {
    try {
      const id = req.user.userId;
      this.userService.deleteUser(id);
      return {
        success: true,
        message: 'Success',
        data: undefined,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: 'Failed',
        data: e,
      };
    }
  }
}
