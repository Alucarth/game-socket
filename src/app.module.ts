import { join } from 'path';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ChatModule } from './chat/chat.module';
import { QuestionModule } from './question/question.module';
import { DatabaseModule } from './database/database.module';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';
import { ResultModule } from './result/result.module';

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
  ],
})
export class AppModule {}
