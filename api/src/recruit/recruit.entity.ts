import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Recruit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    studentId: string;

    @Column()
    personalEmail: string;

    @Column()
    gsuiteEmail: string;

    @Column()
    phoneNumber: string;

    @Column()
    enrollmentSemester: string;

    @Column()
    residentialSemester: string;

    @Column()
    currentSemester: string;

    @Column()
    preferedDepartment: string;

    @Column()
    preferedDepartment2: string;

    @Column({ nullable: true })
    hobbies: string;

    @Column('text')
    about: string;

    @Column({ nullable: true })
    skills: string;

    @Column()
    facebookLink: string;

    @Column({ nullable: true })
    linkedinLink: string;

    @Column({ nullable: true })
    githubLink: string;

    @Column({ nullable: true })
    portfolioLink: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

