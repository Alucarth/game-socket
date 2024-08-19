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
export interface Avatar {
  uuid: string;
  name: string;
  path: string;
}

@Injectable()
export class ChatService {
  private clients: Record<string, User> = {};
  private avatars: Record<string, Avatar> = {};
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(QuestionOption)
    private questionOptionRepository: Repository<QuestionOption>,
  ) {
    const lacteos: Avatar = {
      uuid: '',
      name: 'LACTEOS',
      path: '1.png',
    };
    this.avatars[lacteos.name] = lacteos;

    const almendra: Avatar = {
      uuid: '',
      name: 'ALMENDRA',
      path: '2.png',
    };
    this.avatars[almendra.name] = almendra;

    const nectares: Avatar = {
      uuid: '',
      name: 'NECTARES',
      path: '3.png',
    };
    this.avatars[nectares.name] = nectares;

    const apicola: Avatar = {
      uuid: '',
      name: 'APICOLA',
      path: '4.png',
    };
    this.avatars[apicola.name] = apicola;
  }

  onClientConnected(client: User) {
    this.clients[client.uuid] = client;
    // let disponible = Object.entries(this.avatars).find( ([name,])=> o.uuid  === ''))
  }

  onClientDisconnected(uuid: string) {
    delete this.clients[uuid];
    console.log('uuid disconected', uuid);
  }

  getClients() {
    // const list = Object.values(this.clients);

    return Object.values(this.clients);
  }

  getAvatars() {
    return Object.values(this.avatars);
  }

  setAvatar(avatar: Avatar) {
    this.avatars[avatar.name] = avatar;
  }

  clearAvatar(uuid: string) {
    const lista = this.getAvatars();

    lista.map((avatar) => {
      if (avatar.uuid === uuid) {
        avatar.uuid = '';
        this.avatars[avatar.name] = avatar;
      }
    });
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
