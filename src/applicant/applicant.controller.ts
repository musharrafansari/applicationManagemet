import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/guards/roles.guard';
import { RolesEnum } from '../auth/enums/roles.enum';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { multerConfig } from 'src/upload/multer.config';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Applicants')
@Controller('applicants')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}



//
@Post('resume')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiBearerAuth()
@Roles(RolesEnum.ADMIN, RolesEnum.HR, RolesEnum.REVIEWER)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/resumes',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(new BadRequestException('Only PDFs are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload a resume PDF and get its URL' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  async uploadResume(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required and must be a PDF');
    }

    const fileUrl = `http://localhost:3000/uploads/resumes/${file.filename}`; // just for dummy purpose
    return { fileUrl };
  }
//
@Post()
@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiBearerAuth()
@Roles(RolesEnum.ADMIN, RolesEnum.HR, RolesEnum.REVIEWER)
@UseInterceptors(
  FileInterceptor('resume', {
    storage: diskStorage({
      destination: './uploads/resumes',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Only PDFs are allowed'), false);
      }
      cb(null, true);
    },
  }),
)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new applicant with resume (PDF only)' })
  @ApiResponse({ status: 201, description: 'Applicant created successfully' })
  create(
    @Body() dto: CreateApplicantDto,
  ) {
    return this.applicantService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN, RolesEnum.HR, RolesEnum.REVIEWER)
  @ApiOperation({ summary: 'Get all applicants with optional filters' })
  @ApiResponse({ status: 200, description: 'List of applicants' })
  findAll(@Query() query: any) {
    return this.applicantService.findAll(query);
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN, RolesEnum.HR, RolesEnum.REVIEWER)
  @ApiOperation({ summary: 'Get applicant by ID' })
  @ApiResponse({ status: 200, description: 'Applicant found' })
  findOne(@Param('id') id: string) {
    return this.applicantService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN, RolesEnum.HR)
  @ApiOperation({ summary: 'Update applicant by ID' })
  @ApiResponse({ status: 200, description: 'Applicant updated' })
  update(@Param('id') id: string, @Body() dto: UpdateApplicantDto) {
    return this.applicantService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Delete applicant by ID' })
  @ApiResponse({ status: 200, description: 'Applicant deleted' })
  remove(@Param('id') id: string) {
    return this.applicantService.remove(id);
  }

  @Post(':id/schedule')
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN, RolesEnum.HR)
  @ApiOperation({ summary: 'Schedule an interview for an applicant' })
  @ApiResponse({ status: 200, description: 'Interview scheduled' })
  scheduleInterview(@Param('id') id: string, @Body('date') date: Date) {
    return this.applicantService.scheduleInterview(id, new Date(date));
  }

  @Post(':id/select')
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN, RolesEnum.REVIEWER)
  @ApiOperation({ summary: 'Mark an applicant as selected' })
  @ApiResponse({ status: 200, description: 'Applicant marked as selected' })
  select(@Param('id') id: string) {
    return this.applicantService.markSelected(id);
  }

  @Post(':id/reject')
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Roles(RolesEnum.ADMIN, RolesEnum.REVIEWER)
  @ApiOperation({ summary: 'Mark an applicant as rejected' })
  @ApiResponse({ status: 200, description: 'Applicant marked as rejected' })
  reject(@Param('id') id: string) {
    return this.applicantService.markRejected(id);
  }
}
