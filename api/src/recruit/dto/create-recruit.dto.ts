import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecruitDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    studentId: string;

    @ApiProperty()
    personalEmail: string;

    @ApiProperty()
    gsuiteEmail: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    enrollmentSemester: string;

    @ApiProperty()
    residentialSemester: string;

    @ApiProperty()
    currentSemester: string;

    @ApiProperty()
    preferedDepartment: string;

    @ApiProperty()
    preferedDepartment2: string;

    @ApiPropertyOptional()
    hobbies?: string;

    @ApiProperty()
    about: string;

    @ApiPropertyOptional()
    skills?: string;

    @ApiProperty()
    facebookLink: string;

    @ApiPropertyOptional()
    linkedinLink?: string;

    @ApiPropertyOptional()
    githubLink?: string;

    @ApiPropertyOptional()
    portfolioLink?: string;
}

