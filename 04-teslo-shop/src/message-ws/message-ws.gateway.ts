import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../auth/interfaces/payload.interface';

@WebSocketGateway({ cors: true, namespace: '/' })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService
  ) { }

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers['authorization'];
    let payload: IJwtPayload;

    try {
      payload = this.jwtService.verify(token || '');

      console.log('Client connected: ', client.id);

      await this.messageWsService.registerClient(client, payload.id);

      this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
    } catch (error) {
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);

    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  @SubscribeMessage('client-message')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log(client.id, payload)

    //!Emite unicacmente al cliente que mando el mensaje
    // client.emit('server-message', { fullName: 'Yo', message: payload.message })

    // //!Emite a todos menos al cliente que mando el mensaje
    // client.broadcast.emit('server-message', { fullName: 'soy yo', message: payload.message });

    //Emitir a todos los clientes sin excepción
    this.wss.emit('server-message', {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message
    });
  }
}
