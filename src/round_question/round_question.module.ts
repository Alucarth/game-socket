import { Module } from '@nestjs/common';
import { RoundQuestionService } from './round_question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoundQuestion } from './entities/round_question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoundQuestion])],
  providers: [RoundQuestionService],
  exports: [RoundQuestionService],
})
export class RoundQuestionModule {}
