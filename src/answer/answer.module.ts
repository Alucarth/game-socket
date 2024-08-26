import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { RoundQuestionModule } from 'src/round_question/round_question.module';

@Module({
  imports: [TypeOrmModule.forFeature([Answer]), RoundQuestionModule],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
