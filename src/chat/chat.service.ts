import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/question/entities/question.entity';
import { QuestionOption } from 'src/question/entities/question_option.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

// interface Client {
//   id: string;
//   name: string;
// }

@Injectable()
export class ChatService {
  private clients: Record<string, User> = {};

  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(QuestionOption)
    private questionOptionRepository: Repository<QuestionOption>,
  ) {}

  onClientConnected(client: User) {
    this.clients[client.uuid] = client;
  }

  onClientDisconnected(uuid: string) {
    delete this.clients[uuid];
    console.log('uuid disconected', uuid);
  }

  getClients() {
    return Object.values(this.clients);
  }

  getClientsPlayers() {
    const list = Object.values(this.clients);
    const client_list = [];
    list.forEach((client) => {
      if (client.type === 'player') {
        client_list.push(client);
      }
    });
    return client_list;
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
