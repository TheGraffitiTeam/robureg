import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Recruit } from './recruit.entity';
import { CreateRecruitDto } from './dto/create-recruit.dto';
import { UpdateRecruitDto } from './dto/update-recruit.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class RecruitService {
    constructor(
        @InjectRepository(Recruit)
        private recruitRepository: Repository<Recruit>,
        private readonly mailerService: MailerService,
    ) { }

    async create(createRecruitDto: CreateRecruitDto): Promise<Recruit> {
        try {
            const recruit = this.recruitRepository.create(createRecruitDto);
            const saved = await this.recruitRepository.save(recruit);

            // fire-and-forget email; don't block create on mail failures
            void this.mailerService.sendMail({
                to: saved.personalEmail || saved.gsuiteEmail,
                subject: 'ROBU Recruitment Registration Successful',
                text: `Hi ${saved.firstName}, your registration has been received successfully. We will contact you with next steps.`,
                html: `<p>Hi <strong>${saved.firstName}</strong>,</p><p>Your registration has been received successfully. We will contact you with next steps.</p><p>- ROBU Team</p>`
            }).catch((err) => {
                Logger.warn(`Failed to send registration email to ${saved.personalEmail || saved.gsuiteEmail}: ${err?.message}`);
            });

            return saved;
        } catch (error) {
            if (error instanceof QueryFailedError) {
                const message = error.message;

                if (message.includes('UNIQUE constraint failed: recruit.studentId')) {
                    throw new ConflictException(
                        `A recruit with student ID "${createRecruitDto.studentId}" has already been submitted. Each student can only submit once.`
                    );
                }

                if (message.includes('UNIQUE constraint failed')) {
                    throw new ConflictException('A recruit with these details already exists.');
                }

                throw new BadRequestException(`Database error: ${message}`);
            }
            throw error;
        }
    }

    async findAll(): Promise<Recruit[]> {
        return await this.recruitRepository.find();
    }

    async findOne(id: number): Promise<Recruit> {
        const recruit = await this.recruitRepository.findOne({ where: { id } });
        if (!recruit) {
            throw new NotFoundException(`Recruit with ID ${id} not found`);
        }
        return recruit;
    }

    async update(id: number, updateRecruitDto: UpdateRecruitDto): Promise<Recruit> {
        const recruit = await this.findOne(id);
        Object.assign(recruit, updateRecruitDto);

        try {
            return await this.recruitRepository.save(recruit);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                const message = error.message;

                if (message.includes('UNIQUE constraint failed: recruit.studentId')) {
                    throw new ConflictException(
                        `Another recruit already exists with student ID "${updateRecruitDto.studentId}".`
                    );
                }

                if (message.includes('UNIQUE constraint failed')) {
                    throw new ConflictException('A recruit with these details already exists.');
                }

                throw new BadRequestException(`Database error: ${message}`);
            }
            throw error;
        }
    }

    async remove(id: number): Promise<void> {
        const recruit = await this.findOne(id);
        await this.recruitRepository.remove(recruit);
    }
}

