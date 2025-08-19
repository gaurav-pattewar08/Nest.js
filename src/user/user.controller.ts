import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  Body,
  HttpStatus,
  Res,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../common/services/response.service';
import type { Response } from 'express';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
    @Res() res: Response,
  ) {
    const { page, limit } = query;

    const users = await this.userService.findAll(page, limit);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.userService.findOne(+id);
      ApiResponse.send(res, user, 'User retrieved successfully', HttpStatus.OK);
    } catch (error) {
      ApiResponse.send(res, null, 'User not found', HttpStatus.NOT_FOUND, true);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.update(+id, updateUserDto);
      ApiResponse.send(res, user, 'User updated successfully', HttpStatus.OK);
    } catch (error) {
      ApiResponse.send(res, null, 'User not found', HttpStatus.NOT_FOUND, true);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.userService.remove(+id);
      ApiResponse.send(res, null, 'User deleted successfully', HttpStatus.OK);
    } catch (error) {
      ApiResponse.send(res, null, 'User not found', HttpStatus.NOT_FOUND, true);
    }
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
      limits: { fileSize: 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
          return cb(
            new BadRequestException('Only JPEG/PNG files allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    return { filename: file.filename, size: file.size };
  }
}
