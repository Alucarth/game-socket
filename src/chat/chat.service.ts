import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/question/entities/question.entity';
import { QuestionOption } from 'src/question/entities/question_option.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

// interface Client {
//   id: string;
//   name: string;
// }
export interface Avatar {
  id: number;
  name: string;
  path: string;
}

export interface AnswerInterface {
  round_id: number;
  user_id: number;
  question_id: number;
  question_option_id: number;
  question_score: number;
  is_correct: boolean;
}

export interface RoundQuestionInferface {
  round_id: number;
  question_id: number;
  index: number;
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
    private readonly userService: UserService,
  ) {
    const lacteos: Avatar = {
      id: 1,
      name: 'LACTEOS',
      path: '1.png',
    };
    this.avatars[lacteos.name] = lacteos;

    const almendra: Avatar = {
      id: 2,
      name: 'ALMENDRA',
      path: '2.png',
    };
    this.avatars[almendra.name] = almendra;

    const nectares: Avatar = {
      id: 3,
      name: 'NECTARES',
      path: '3.png',
    };
    this.avatars[nectares.name] = nectares;

    const apicola: Avatar = {
      id: 4,
      name: 'APICOLA',
      path: '4.png',
    };
    this.avatars[apicola.name] = apicola;

    const personaje6: Avatar = {
      id: 6,
      name: 'personaje6',
      path: '6.png',
    };
    this.avatars[personaje6.name] = personaje6;

    const personaje7: Avatar = {
      id: 7,
      name: 'personaje7',
      path: '7.png',
    };
    this.avatars[personaje7.name] = personaje7;

    const personaje8: Avatar = {
      id: 8,
      name: 'personaje8',
      path: '8.png',
    };
    this.avatars[personaje8.name] = personaje8;

    const personaje9: Avatar = {
      id: 9,
      name: 'personaje9',
      path: '9.png',
    };
    this.avatars[personaje9.name] = personaje9;

    const personaje10: Avatar = {
      id: 10,
      name: 'personaje10',
      path: '10.png',
    };
    this.avatars[personaje10.name] = personaje10;

    const personaje11: Avatar = {
      id: 11,
      name: 'personaje11',
      path: '11.png',
    };
    this.avatars[personaje11.name] = personaje11;
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
    return Object.values(this.clients);
  }

  getAvatars() {
    return Object.values(this.avatars);
  }

  async updateClients() {
    const list = Object.values(this.clients);
    await Promise.all(
      list.map(async (client) => {
        const user = await this.userService.findByUUID(client.uuid);
        this.clients[user.uuid] = user;
      }),
    );
  }

  // setAvatar(avatar: Avatar) {
  //   console.log('seteando avagtar', avatar);
  //   // console.log('uuid ', uuid);
  //   // avatar.uuid = uuid;
  //   // this.avatars[avatar.name] = avatar;
  //   console.log(this.avatars);
  // }

  // clearAvatar(uuid: string) {
  //   const lista = this.getAvatars();

  //   // lista.map((avatar) => {
  //   //   if (avatar.uuid === uuid) {
  //   //     avatar.uuid = '';
  //   //     this.avatars[avatar.name] = avatar;
  //   //   }
  //   // });
  // }

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
