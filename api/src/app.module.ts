import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecruitModule } from './recruit/recruit.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => {
        dotenv.config();
        return {
          transport: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          },
          defaults: {
            from: process.env.MAIL_FROM || 'noreply@example.com',
          },
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: 'database.sqlite',
      autoSave: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // disable in production
    }),
    AuthModule,
    RecruitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
