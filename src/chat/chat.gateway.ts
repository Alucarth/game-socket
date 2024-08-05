import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { ChatService } from './chat.service';
import { Question } from 'src/question/entities/question.entity';
@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;
  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      const { name, token } = socket.handshake.auth;

      if (!name) {
        socket.disconnect();
        return;
      }

      console.log('cliente conectado', socket.handshake.auth);
      console.log({ name, token });
      console.log({ id: socket.id, name: name });
      this.chatService.onClientConnected({ id: socket.id, name: name }); //TODO: donde id tiene que ser CI
      // this.chatService.onClientConnected({
      //   id: 'Z51pFTG7LrhtoV_qAAAB',
      //   name: 'keyrus',
      // });
      socket.emit('welcome-service', 'Bienvenido al Servidor');

      this.server.emit('on-clients-changed', this.chatService.getClients());

      // this.server.emit('on-question-list', this.chatService.getQuestions());

      socket.on('disconnect', () => {
        console.log('CLIENTE DESCONECTADO');
        this.chatService.onClientDisconnected(socket.id);
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
