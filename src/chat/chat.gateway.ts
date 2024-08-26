import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import {
  AnswerInterface,
  Avatar,
  ChatService,
  RoundQuestionInferface,
} from './chat.service';
import { Question } from 'src/question/entities/question.entity';
import { UserService } from 'src/user/user.service';
import { AnswerService } from 'src/answer/answer.service';
import { RoundService } from 'src/round/round.service';
import { RoundQuestionService } from 'src/round_question/round_question.service';
@WebSocketGateway({ cors: true })
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly answerService: AnswerService,
    private readonly roundService: RoundService,
    private readonly roundQuestionService: RoundQuestionService,
  ) {}

  onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      const { name, token, uuid, type } = socket.handshake.auth;

      if (!name) {
        socket.disconnect();
        return;
      }

      console.log('cliente conectado', socket.handshake.auth);
      console.log({ name, token, uuid, type });
      console.log({ id: socket.id, name: name, type: type });
      const user = await this.userService.getUser({
        id: 0,
        name: name,
        uuid: uuid,
        type: type,
        avatar_id: null,
      });
      console.log(user);
      if (type === 'player') {
        if (this.chatService.getClientsPlayers().length < 4) {
          this.chatService.onClientConnected(user); //TODO: donde id tiene que ser CI
        } else {
          socket.emit('server-full', 'Jugadores Completos por favor espere');
        }
      }

      socket.emit('welcome-service', user);

      this.server.emit('on-clients-changed', this.chatService.getClients());

      this.server.emit('on-avatars-changed', this.chatService.getAvatars());

      // this.server.emit('on-question-list', this.chatService.getQuestions());

      socket.on('disconnect', async () => {
        console.log('CLIENTE DESCONECTADO');
        const { uuid } = socket.handshake.auth;
        this.chatService.onClientDisconnected(uuid);
        this.userService.clearAvatar(uuid);
        // this.chatService.clearAvatar(uuid);
        await this.chatService.updateClients();
        this.server.emit('on-clients-changed', this.chatService.getClients());
      });
    });
  }

  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, token } = client.handshake.auth;
    console.log({ name, message });

    if (!message) {
      return;
    }

    this.server.emit('on-message', {
      userId: client.id,
      message: message,
      name: name,
    });
  }

  @SubscribeMessage('send-answer')
  async sendAnsware(
    @MessageBody() answer: AnswerInterface,
    @ConnectedSocket() client: Socket,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, token } = client.handshake.auth;
    // console.log({ name, message });

    if (!answer) {
      return;
    }
    //registrar respuesta
    const result = await this.answerService.createAnswer(answer);

    client.emit('send-message', result);
    // this.server.emit('on-message', {
    //   userId: client.id,
    //   message: message,
    //   name: name,
    // });
  }

  @SubscribeMessage('set-avatar')
  async setAvatar(
    @MessageBody() avatar: Avatar,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('set avatar', avatar);
    const { uuid } = client.handshake.auth;
    console.log('auth', client.handshake.auth);
    const user = await this.userService.setAvatar(uuid, avatar.id);
    client.emit('welcome-service', user);
    // this.chatService.onClientConnected(user);
    //aqui solo deberia actualizar al mio
    await this.chatService.updateClients();
    this.server.emit('on-clients-changed', this.chatService.getClients());
    // const new_avatar = Object.assign({}, avatar);
    // // new_avatar.uuid = uuid;
    // this.chatService.setAvatar(new_avatar);
    // this.server.emit('on-avatars-changed', this.chatService.getAvatars());
    // console.log('set avatar ', new_avatar);
  }

  @SubscribeMessage('send-command')
  async sendCommand(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, token } = client.handshake.auth;
    console.log({ name, message });

    if (!message) {
      return;
    }

    console.log('message', message);

    //aqqui colocar la ronda id
    const round = await this.roundService.createRound();
    console.log('round', round);
    this.server.emit('on-round', round);

    const questions = await this.chatService.getQuestions();
    this.server.emit('on-question-list', questions);
  }

  //moderador
  @SubscribeMessage('send-question')
  async sendQuestion(
    @MessageBody() question: Question,
    @ConnectedSocket() client: Socket,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, token } = client.handshake.auth;
    console.log(question);
    const response = await this.chatService.getQuestion(question.id);
    this.server.emit('on-open-question', response);
  }

  @SubscribeMessage('send-round-question')
  async sendRoundQuestion(
    @MessageBody() round_question: RoundQuestionInferface,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, token } = clientSocket.handshake.auth;
    console.log(round_question);
    // const response = await this.chatService.getQuestion(question.id);
    const response_round =
      await this.roundQuestionService.create(round_question);
    console.log('question round ', response_round);

    const clients = this.chatService.getClients();
    console.log('clientes ', clients);
    const questions_round = await this.roundQuestionService.getQuestions(
      round_question.round_id,
    );

    // table content
    const result = [];

    await Promise.all(
      clients.map(async (client) => {
        console.log('======================>', client);
        const client_result = { client: client, questions: [], score: 0 };
        console.log(client_result);
        await Promise.all(
          questions_round.map(async (question, index) => {
            const response = await this.answerService.getResult(
              question.round_id,
              client.id,
              question.question_id,
              question.index,
            );
            if (response) {
              //colocar aqui datos relevantes crear estructura
              const question_result = {
                index: index + 1,
                is_correct: response.is_correct,
                score: response.score,
              };
              // result.push(question_result);
              if (question_result.is_correct) {
                client_result.score += question_result.score;
              }
              client_result.questions.push(question_result);
            } else {
              const question_result = {
                index: index + 1,
                is_correct: false,
                score: 0,
              };
              // result.push(question_result);
              client_result.questions.push(question_result);
            }
          }),
        );

        // const client_answer = Object.assign({}, client_result);
        result.push(client_result);
        // client_result = { client: null, questions: [], score: 0 };
      }),
    );
    clientSocket.emit('on-table-result', result);
    clientSocket.emit('on-question-count', questions_round.length);
    // this.server.emit('on-open-question', response);
  }

  @SubscribeMessage('get-table-result')
  async getTableResult(
    @MessageBody() round_id: number,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, token } = clientSocket.handshake.auth;
    // console.log(round_question);
    // const response = await this.chatService.getQuestion(question.id);

    const clients = this.chatService.getClients();
    console.log('clientes ', clients);
    const questions_round =
      await this.roundQuestionService.getQuestions(round_id);

    // table content
    const result = [];

    await Promise.all(
      clients.map(async (client) => {
        console.log('======================>', client);
        const client_result = { client: client, questions: [], score: 0 };
        console.log(client_result);
        await Promise.all(
          questions_round.map(async (question, index) => {
            const response = await this.answerService.getResult(
              question.round_id,
              client.id,
              question.question_id,
              question.index,
            );
            if (response) {
              //colocar aqui datos relevantes crear estructura
              const question_result = {
                index: index + 1,
                is_correct: response.is_correct,
                score: response.score,
              };
              // result.push(question_result);
              if (question_result.is_correct) {
                client_result.score += question_result.score;
              }
              client_result.questions.push(question_result);
            } else {
              const question_result = {
                index: index + 1,
                is_correct: false,
                score: 0,
              };
              // result.push(question_result);
              client_result.questions.push(question_result);
            }
          }),
        );

        // const client_answer = Object.assign({}, client_result);
        result.push(client_result);
        // client_result = { client: null, questions: [], score: 0 };
      }),
    );
    clientSocket.emit('on-table-result', result);
    clientSocket.emit('on-question-count', questions_round.length);
    // this.server.emit('on-open-question', response);
  }
}
