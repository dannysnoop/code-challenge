import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as moment from 'moment';
import { OnModuleInit } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

const data = {};
const tokenCheck = {};
@WebSocketGateway(4001, { cors: true })
export class ChatWsGatewayService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor() {}

  autoSendAmountToClient(amount = 0, userId = 0) {
    const clientId = data[userId];
    this.server.to(clientId).emit('amountClient' , amount)
  }

  @SubscribeMessage('verifyAuth')
  async sendMessageToClient(client: Socket, token = ''): Promise<void> {
    // Extract client ID
    const clientId = client.id;
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      data[payload.id] = clientId;
    }catch (e) {

    }

  }

  afterInit(server: any): any {}

  async handleConnection(client: Socket, ...args: any[]) {
    const clientId = client.id;
    const token = client.handshake.auth.token;
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      data[payload.id] = clientId;
    }catch (e) {

    }
  }

  handleDisconnect(client: any): any {}
}
