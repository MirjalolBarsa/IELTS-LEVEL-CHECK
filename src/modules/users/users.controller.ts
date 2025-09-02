import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Yangi foydalanuvchi yaratish (Admin uchun)' })
    @ApiResponse({
        status: 201,
        description: 'Foydalanuvchi muvaffaqiyatli yaratildi',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 409, description: 'Foydalanuvchi allaqachon mavjud' })
    @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi' })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish' })
    @ApiResponse({
        status: 200,
        description: 'Foydalanuvchilar ro\'yxati',
        type: [UserResponseDto],
    })
    @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Joriy foydalanuvchi ma\'lumotlari' })
    @ApiResponse({
        status: 200,
        description: 'Foydalanuvchi ma\'lumotlari',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi' })
    getMe(@Request() req) {
        return this.usersService.findOne(req.user.id);
    }

    @Get('me/stats')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Joriy foydalanuvchi statistikasi' })
    @ApiResponse({
        status: 200,
        description: 'Foydalanuvchi test statistikasi',
    })
    @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi' })
    getMyStats(@Request() req) {
        return this.usersService.getUserStats(req.user.id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Foydalanuvchini ID bo\'yicha olish' })
    @ApiParam({ name: 'id', description: 'Foydalanuvchi ID' })
    @ApiResponse({
        status: 200,
        description: 'Foydalanuvchi ma\'lumotlari',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
    @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Get(':id/stats')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Foydalanuvchi statistikasi' })
    @ApiParam({ name: 'id', description: 'Foydalanuvchi ID' })
    @ApiResponse({
        status: 200,
        description: 'Foydalanuvchi test statistikasi',
    })
    @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
    @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi' })
    getUserStats(@Param('id') id: string) {
        return this.usersService.getUserStats(id);
    }

    @Patch('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Joriy foydalanuvchi ma\'lumotlarini yangilash' })
    @ApiResponse({
        status: 200,
        description: 'Foydalanuvchi muvaffaqiyatli yangilandi',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 409, description: 'Foydalanuvchi nomi yoki email allaqachon mavjud' })
    @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi' })
    updateMe(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(req.user.id, updateUserDto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Foydalanuvchini yangilash (Admin uchun)' })
    @ApiParam({ name: 'id', description: 'Foydalanuvchi ID' })
    @ApiResponse({
        status: 200,
        description: 'Foydalanuvchi muvaffaqiyatli yangilandi',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
    @ApiResponse({ status: 409, description: 'Foydalanuvchi nomi yoki email allaqachon mavjud' })
    @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi' })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Foydalanuvchini o\'chirish (Admin uchun)' })
    @ApiParam({ name: 'id', description: 'Foydalanuvchi ID' })
    @ApiResponse({
        status: 200,
        description: 'Foydalanuvchi muvaffaqiyatli o\'chirildi',
    })
    @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
    @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
