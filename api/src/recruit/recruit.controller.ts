import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RecruitService } from './recruit.service';
import { CreateRecruitDto } from './dto/create-recruit.dto';
import { UpdateRecruitDto } from './dto/update-recruit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('recruits')
@Controller('recruits')
export class RecruitController {
    constructor(private readonly recruitService: RecruitService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new recruit' })
    @ApiResponse({ status: 201, description: 'Recruit created successfully' })
    @ApiResponse({ status: 409, description: 'Student ID already exists' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    create(@Body() createRecruitDto: CreateRecruitDto) {
        return this.recruitService.create(createRecruitDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all recruits' })
    @ApiResponse({ status: 200, description: 'List of all recruits' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findAll() {
        return this.recruitService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a recruit by ID' })
    @ApiResponse({ status: 200, description: 'Recruit found' })
    @ApiResponse({ status: 404, description: 'Recruit not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findOne(@Param('id') id: string) {
        return this.recruitService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a recruit' })
    @ApiResponse({ status: 200, description: 'Recruit updated successfully' })
    @ApiResponse({ status: 404, description: 'Recruit not found' })
    @ApiResponse({ status: 409, description: 'Student ID already exists' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    update(@Param('id') id: string, @Body() updateRecruitDto: UpdateRecruitDto) {
        return this.recruitService.update(+id, updateRecruitDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a recruit' })
    @ApiResponse({ status: 204, description: 'Recruit deleted successfully' })
    @ApiResponse({ status: 404, description: 'Recruit not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    remove(@Param('id') id: string) {
        return this.recruitService.remove(+id);
    }
}

