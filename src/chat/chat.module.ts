import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/question/entities/question.entity';
import { QuestionOption } from 'src/question/entities/question_option.entity';
import { UserModule } from 'src/user/user.module';

import { RoundModule } from 'src/round/round.module';
import { AnswerModule } from 'src/answer/answer.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [
    TypeOrmModule.forFeature([Question, QuestionOption]),
    UserModule,
    RoundModule,
    AnswerModule,
  ],
})
export class ChatModule {}
