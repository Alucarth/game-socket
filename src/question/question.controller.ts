import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly _questionService: QuestionService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return await this._questionService.getAll();
  }
}
