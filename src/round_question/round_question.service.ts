import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoundQuestion } from './entities/round_question.entity';
import { Repository } from 'typeorm';
import { RoundQuestionInferface } from 'src/chat/chat.service';

@Injectable()
export class RoundQuestionService {
  constructor(
    @InjectRepository(RoundQuestion)
    private roundQuestionRespository: Repository<RoundQuestion>,
  ) {}

  async create(payload: RoundQuestionInferface) {
    const questions = await this.roundQuestionRespository.find({
      where: { round_id: payload.round_id },
    });
    payload.index = questions.length + 1;
    return await this.roundQuestionRespository.save(payload);
  }

  async getQuestions(round_id: number) {
    return await this.roundQuestionRespository.find({
      where: { round_id: round_id },
      order: { index: 'ASC' },
    });
  }
}
