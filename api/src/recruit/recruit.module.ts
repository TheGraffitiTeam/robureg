import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruitController } from './recruit.controller';
import { RecruitService } from './recruit.service';
import { Recruit } from './recruit.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Recruit])],
    controllers: [RecruitController],
    providers: [RecruitService],
})
export class RecruitModule { }

