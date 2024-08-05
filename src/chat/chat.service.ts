import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/question/entities/question.entity';
import { QuestionOption } from 'src/question/entities/question_option.entity';
import { Repository } from 'typeorm';

interface Client {
  id: string;
  name: string;
}

@Injectable()
export class ChatService {
  private clients: Record<string, Client> = {};

  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(QuestionOption)
    private questionOptionRepository: Repository<QuestionOption>,
  ) {}

  onClientConnected(client: Client) {
    this.clients[client.id] = client;
  }

  onClientDisconnected(id: string) {
    delete this.clients[id];
  }

  getClients() {
    return Object.values(this.clients);
  }

  async getQuestions() {
    const lista = await this.questionRepository.find();
    console.log(lista);
    return lista;
  }

  async getQuestion(id: number) {
    const question = await this.questionRepository.findOneBy({ id: id });
    if (question) {
      const options = await this.questionOptionRepository.find({
        where: { question_id: question.id },
      });

      return { question, options };
    }
    return null;
  }
}
