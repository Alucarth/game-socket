import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/question/entities/question.entity';
import { QuestionOption } from 'src/question/entities/question_option.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [TypeOrmModule.forFeature([Question, QuestionOption]), UserModule],
})
export class ChatModule {}
