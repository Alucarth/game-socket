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
