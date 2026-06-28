// import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
// import * as amqp from 'amqplib';
// import { FileService } from '../file/services/file.service';
// import { SocketService } from '../socket/socket.service';

// @Injectable()
// export class RabbitMQService implements OnModuleInit {
//   private readonly logger = new Logger(RabbitMQService.name);
//   private connection: amqp.Connection;
//   private channel: amqp.Channel;

//   constructor(
//     private readonly fileService: FileService,
//     private readonly socketService: SocketService,
//   ) {}

//   async onModuleInit() {
//     await this.connect();
//   }

//   private async connect() {
//     this.logger.log('Iniciando conexão com RabbitMQ...');
//     try {
//       this.connection = await amqp.connect(
//         `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
//       );
//       this.channel = await this.connection.createChannel();
//       await this.channel.assertQueue('FILE_TO_CONSUM', { durable: true });

//       this.logger.log('Conectado ao RabbitMQ e fila FILE_TO_CONSUM declarada.');
//       this.consumeMessages();
//     } catch (error) {
//       this.logger.error('Erro ao conectar ao RabbitMQ:', error);
//     }
//   }

//   private async consumeMessages() {
//     this.channel.consume('FILE_TO_CONSUM', async (message) => {
//       if (message) {
//         const content = JSON.parse(message.content.toString());
//         try {
//           this.logger.log(
//             `Recebida mensagem para processamento: file_id=${content.file_id}`,
//           );

//           const processed = await this.fileService.consumCsv(content.file_id);
//           await this.socketService.emitToAll('file-processed', {
//             payload: `file ${content.file_id} processed`,
//             completed: true,
//           });
//           if (!processed) {
//             this.logger.warn(
//               `Arquivo com ID ${content.file_id} não foi processado.`,
//             );
//             return this.channel.nack(message);
//           }

//           this.channel.ack(message);
//           this.logger.log(
//             `Mensagem processada com sucesso: file_id=${content.file_id}`,
//           );
//         } catch (error) {
//           await this.socketService.emitToAll('file-processed', {
//             payload: `file ${content.file_id} processed`,
//             completed: false,
//           });
//           this.logger.error('Erro ao processar mensagem:', error);
//           this.channel.nack(message);
//         }
//       }
//     });

//     this.logger.log('Escutando mensagens na fila FILE_TO_CONSUM...');
//   }
// }
