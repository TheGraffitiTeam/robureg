import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecruitModule } from './recruit/recruit.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
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
