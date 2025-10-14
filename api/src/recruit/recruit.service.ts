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
                text: `Hi ${saved.firstName}, your registration for the Robotics Club of BRAC University has been received successfully. You will be contacted soon with details about your interview.`,
                html: `
                <!DOCTYPE html>
                <html lang="en" style="margin:0;padding:0;">
                  <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width" />
                    <title>ROBU Recruitment Registration Successful</title>
                  </head>
                  <body style="margin:0;padding:0;background:#f6f7f9;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f6f7f9;margin:0;padding:20px 0;">
                      <tr>
                        <td align="center">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:640px;background:#ffffff;">
                            <tr>
                              <td style="padding:24px 24px 8px 24px;font-family:Arial,Helvetica,sans-serif;">
                                <h1 style="margin:0 0 8px 0;font-size:20px;line-height:1.3;font-weight:600;color:#111111;">
                                  Robotics Club of BRAC University – Recruitment Update
                                </h1>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:0 24px 4px 24px;font-family:Arial,Helvetica,sans-serif;color:#111111;font-size:14px;line-height:1.6;">
                                <p style="margin:0 0 12px 0;">Dear <strong>${saved.firstName}</strong>,</p>
                                <p style="margin:0 0 12px 0;">
                                  Congratulations on successfully completing the first step of your application to join the <strong>Robotics Club of BRAC University (ROBU)</strong>.
                                </p>
                                <p style="margin:0 0 12px 0;">
                                  Your registration has been received. Our team will contact you soon with further details.
                                </p>
                                <p style="margin:0 0 12px 0;">
                                  We look forward to meeting you and learning more about your interests and passion for robotics and innovation.
                                </p>
                                <p style="margin:0 0 0 0;">
                                  Best regards,<br />
                                  <strong>Imtiaz</strong><br />
                                  Robotics Club of BRAC University<br />
                                  <a href="mailto:club.robu@g.bracu.ac.bd" style="color:#1a73e8;text-decoration:none;">club.robu@g.bracu.ac.bd</a>
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:16px 24px 24px 24px;font-family:Arial,Helvetica,sans-serif;color:#6b7280;font-size:12px;line-height:1.5;">
                                <p style="margin:0;">
                                  This message was sent by the Robotics Club of BRAC University. For any queries reply to this mail.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
                `
            }).catch((err) => {
                Logger.warn(`Failed to send registration email to \${saved.personalEmail || saved.gsuiteEmail}: \${err?.message}`);
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

