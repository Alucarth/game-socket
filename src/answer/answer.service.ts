import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Repository } from 'typeorm';
import { AnswerInterface } from 'src/chat/chat.service';
import { RoundQuestionService } from 'src/round_question/round_question.service';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    private readonly roundQuestionService: RoundQuestionService,
  ) {}

  async createAnswer(answer: AnswerInterface) {
    const round_questions = await this.roundQuestionService.getQuestions(
      answer.round_id,
    );
    if (answer.is_correct) {
      // revisar las posisiones
      const positions = await this.answerRepository.find({
        where: {
          round_id: answer.round_id,
          question_id: answer.question_id,
          is_correct: true,
        },
      });

      if (positions.length > 0) {
        const count = positions.length;
        const another_answer = {
          user_id: answer.user_id,
          round_id: answer.round_id,
          question_id: answer.question_id,
          question_option_id: answer.question_option_id,
          is_correct: answer.is_correct,
          score: answer.question_score,
          index: round_questions.length,
        };

        if (count === 1) {
          another_answer.score = answer.question_score * 0.75; //75%
        }

        if (count === 2) {
          another_answer.score = answer.question_score * 0.5; //50%
        }

        if (count === 3) {
          another_answer.score = answer.question_score * 0.25; //25%
        }

        return await this.answerRepository.save(another_answer);
      } else {
        const new_answer = {
          user_id: answer.user_id,
          round_id: answer.round_id,
          question_id: answer.question_id,
          question_option_id: answer.question_option_id,
          is_correct: answer.is_correct,
          score: answer.question_score,
          index: round_questions.length,
        };

        return await this.answerRepository.save(new_answer);
      }
    } else {
      const else_answer = {
        user_id: answer.user_id,
        round_id: answer.round_id,
        question_id: answer.question_id,
        question_option_id: answer.question_option_id,
        is_correct: answer.is_correct,
        score: 0,
        index: round_questions.length,
      };
      return await this.answerRepository.save(else_answer);
    }
  }

  async getResult(
    round_id: number,
    user_id: number,
    question_id: number,
    index: number,
  ) {
    return await this.answerRepository.findOne({
      where: {
        round_id: round_id,
        user_id: user_id,
        question_id: question_id,
        index: index,
      },
    });
  }
}
