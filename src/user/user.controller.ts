import { Controller, Get, Patch, Param, Delete, UseGuards, Body, HttpStatus, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../common/services/response.service';
import type { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Res() res: Response) {
    const users = await this.userService.findAll();
    ApiResponse.send(res, users, 'Users retrieved successfully', HttpStatus.OK);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.userService.findOne(+id);
      ApiResponse.send(res, user, 'User retrieved successfully', HttpStatus.OK);
    } catch (error) {
      ApiResponse.send(res, null, 'User not found', HttpStatus.NOT_FOUND, true);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    try {
      const user = await this.userService.update(+id, updateUserDto);
      ApiResponse.send(res, user, 'User updated successfully', HttpStatus.OK);
    } catch (error) {
      ApiResponse.send(res, null, 'User not found', HttpStatus.NOT_FOUND, true);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.userService.remove(+id);
      ApiResponse.send(res, null, 'User deleted successfully', HttpStatus.OK);
    } catch (error) {
      ApiResponse.send(res, null, 'User not found', HttpStatus.NOT_FOUND, true);
    }
  }
}
