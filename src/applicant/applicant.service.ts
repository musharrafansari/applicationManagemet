import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Applicant } from './entities/applicant.entity';
import { CreateApplicantDto} from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';

@Injectable()
export class ApplicantService {
  constructor(
    @InjectRepository(Applicant)
    private readonly applicantRepo: Repository<Applicant>,
  ) {}

  async create(dto: CreateApplicantDto) {
    
    // const applicant = this.applicantRepo.create({
    //   ...dto,
    //   resumeUrl:  "sdasdasdasd"
    // });
    return this.applicantRepo.save(dto);
  }

  findAll(query: any) {
    const { page = 1, limit = 10, name, status, position } = query;
    const where: any = {};
    if (name) where.name = ILike(`%${name}%`);
    if (status) where.status = status;
    if (position) where.position = position;

    return this.applicantRepo.find({
      where,
      skip: (page - 1) * limit,
      take: +limit,
    });
  }

  async findOne(id: string) {
    const applicant = await this.applicantRepo.findOne({ where: { id } });
    if (!applicant) throw new NotFoundException('Applicant not found');
    return applicant;
  }

  async update(id: string, dto: UpdateApplicantDto) {
    await this.applicantRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const applicant = await this.findOne(id);
    await this.applicantRepo.delete(id);
    return { message: 'Applicant deleted' };
  }

  async scheduleInterview(id: string, date: Date) {
    // await this.applicantRepo.update(id, { interviewDate: date });
    return this.findOne(id);
  }

  async markSelected(id: string) {
    // await this.applicantRepo.update(id, { status: 'selected' });
    return this.findOne(id);
  }

  async markRejected(id: string) {
    // await this.applicantRepo.update(id, { status: 'rejected' });
    return this.findOne(id);
  }
}
