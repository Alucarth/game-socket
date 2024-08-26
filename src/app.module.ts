import { join } from 'path';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ChatModule } from './chat/chat.module';
import { QuestionModule } from './question/question.module';
import { DatabaseModule } from './database/database.module';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';
import { ResultModule } from './result/result.module';
import { RoundModule } from './round/round.module';
import { AnswerModule } from './answer/answer.module';
import { RoundQuestionModule } from './round_question/round_question.module';

@Module({
  imports: [
    DatabaseModule,
    ChatModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    QuestionModule,
    EventModule,
    UserModule,
    ResultModule,
    RoundModule,
    AnswerModule,
    RoundQuestionModule,
  ],
})
export class AppModule {}
