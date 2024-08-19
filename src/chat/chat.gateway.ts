import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { Avatar, ChatService } from './chat.service';
import { Question } from 'src/question/entities/question.entity';
import { UserService } from 'src/user/user.service';
@WebSocketGateway({ cors: true })
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
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
      });
      console.log(user);
      if (type === 'player') {
        if (this.chatService.getClientsPlayers().length < 4) {
          this.chatService.onClientConnected(user); //TODO: donde id tiene que ser CI
        } else {
          socket.emit('server-full', 'Jugadores Completos por favor espere');
        }
      }
      // this.chatService.onClientConnected(user); //TODO: donde id tiene que ser CI
      // this.chatService.onClientConnected({
      //   id: 'Z51pFTG7LrhtoV_qAAAB',
      //   name: 'keyrus',
      // });
      socket.emit('welcome-service', user);

      this.server.emit('on-clients-changed', this.chatService.getClients());

      this.server.emit('on-avatars-changed', this.chatService.getAvatars());

      // this.server.emit('on-question-list', this.chatService.getQuestions());

      socket.on('disconnect', () => {
        console.log('CLIENTE DESCONECTADO');
        const { uuid } = socket.handshake.auth;
        this.chatService.onClientDisconnected(uuid);
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

  @SubscribeMessage('set-avatar')
  async setAvatar(
    @MessageBody() avatar: Avatar,
    @ConnectedSocket() client: Socket,
  ) {
    const { name, uuid } = client.handshake.auth;
    console.log('name', name);
    avatar.uuid = uuid;
    this.chatService.setAvatar(avatar);
    this.server.emit('on-avatars-changed', this.chatService.getAvatars());
    console.log('set avatar ', avatar);
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

    const questions = await this.chatService.getQuestions();
    this.server.emit('on-question-list', questions);
  }

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
    // if (!message) {
    //   return;
    // }

    // console.log('message', message);

    // const questions = await this.chatService.getQuestions();
    // this.server.emit('on-question-list', questions);
  }
}
