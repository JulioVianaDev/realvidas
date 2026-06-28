// ============================================================
// ENTITIES
// ============================================================

import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
  JoinColumn, CreateDateColumn, UpdateDateColumn, Index, Unique,
} from 'typeorm'

// ------------------------------------------------------------
// Client
// ------------------------------------------------------------
@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  phone: string

  // null = cliente ativo | preenchido = foi absorvido por outro
  @Column({ name: 'merged_into', nullable: true })
  @Index()
  mergedInto: string | null

  @ManyToOne(() => Client, { nullable: true })
  @JoinColumn({ name: 'merged_into' })
  mergedIntoClient: Client | null

  @OneToMany(() => Contact, c => c.client)
  contacts: Contact[]

  @OneToMany(() => Conversation, c => c.client)
  conversations: Conversation[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

// ------------------------------------------------------------
// ClientMerge  (audit log imutável)
// ------------------------------------------------------------
@Entity('client_merges')
export class ClientMerge {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'winner_id' })
  winnerId: string

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'winner_id' })
  winner: Client

  @Column({ name: 'loser_id' })
  loserId: string

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'loser_id' })
  loser: Client

  @Column({ name: 'merged_by', nullable: true })
  mergedBy: string | null

  @CreateDateColumn({ name: 'merged_at' })
  mergedAt: Date
}

// ------------------------------------------------------------
// Contact  (token de canal: whatsapp, instagram, messenger…)
// ------------------------------------------------------------
@Entity('contacts')
@Unique(['channel', 'token'])
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'client_id' })
  @Index()
  clientId: string

  @ManyToOne(() => Client, c => c.contacts)
  @JoinColumn({ name: 'client_id' })
  client: Client

  @Column()
  channel: string  // 'whatsapp' | 'instagram' | 'messenger'

  @Column()
  token: string    // identificador do canal (ex: phone number, psid)

  @Column({ name: 'display_name', nullable: true })
  displayName: string | null

  @Column({ default: true })
  active: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

// ------------------------------------------------------------
// Conversation
// ------------------------------------------------------------
@Entity('conversations')
@Index('idx_conv_client_last_msg', ['clientId', 'lastMessageAt'])
@Index('idx_conv_contact', ['contactId'])
@Index('idx_conv_channel_client', ['channel', 'clientId'])
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'client_id' })
  clientId: string

  @ManyToOne(() => Client, c => c.conversations)
  @JoinColumn({ name: 'client_id' })
  client: Client

  // qual contato de canal originou esta conversa
  @Column({ name: 'contact_id', nullable: true })
  contactId: string | null

  @ManyToOne(() => Contact, { nullable: true })
  @JoinColumn({ name: 'contact_id' })
  contact: Contact | null

  @Column()
  channel: string

  @Column({ default: 'open' })
  status: string  // 'open' | 'waiting' | 'closed'

  @CreateDateColumn({ name: 'started_at' })
  startedAt: Date

  @Column({ name: 'last_message_at', nullable: true })
  lastMessageAt: Date | null

  @OneToMany(() => Message, m => m.conversation)
  messages: Message[]
}

// ------------------------------------------------------------
// Message
// ------------------------------------------------------------
@Entity('messages')
@Index('idx_msg_conv_sent', ['conversationId', 'sentAt'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'conversation_id' })
  conversationId: string

  @ManyToOne(() => Conversation, c => c.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation

  @Column()
  direction: string  // 'inbound' | 'outbound'

  @Column({ nullable: true, type: 'text' })
  content: string | null

  @Column({ name: 'media_url', nullable: true })
  mediaUrl: string | null

  @CreateDateColumn({ name: 'sent_at' })
  sentAt: Date
}


// ============================================================
// SERVICE
// ============================================================

import { Injectable } from '@nestjs/common'
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm'
import { Repository, DataSource, In } from 'typeorm'

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)       private clients: Repository<Client>,
    @InjectRepository(Contact)      private contacts: Repository<Contact>,
    @InjectRepository(Conversation) private conversations: Repository<Conversation>,
    @InjectRepository(Message)      private messages: Repository<Message>,
    @InjectRepository(ClientMerge)  private merges: Repository<ClientMerge>,
    @InjectDataSource()             private ds: DataSource,
  ) {}

  // ----------------------------------------------------------
  // Resolve o client canônico — sempre 1 query só
  // A cadeia é achatada no merge, então mergedInto aponta
  // direto pro winner final (nunca tem A→B→C, só A→C)
  // ----------------------------------------------------------
  async canonical(clientId: string): Promise<string> {
    const row = await this.clients.findOne({
      where: { id: clientId },
      select: ['id', 'mergedInto'],
    })
    return row?.mergedInto ?? clientId
  }

  // ----------------------------------------------------------
  // Subquery reutilizável: retorna todos os client_ids de uma
  // família (o canonical + todos os losers que apontam pra ele)
  // Roda na tabela clients que é pequena — usa idx merged_into
  // ----------------------------------------------------------
  private familySubquery(): string {
    return `(SELECT id FROM clients WHERE id = :canonical OR merged_into = :canonical)`
  }

  // ----------------------------------------------------------
  // Todas as conversas de um cliente (histórico completo)
  // Conversations nunca são tocadas no merge — o JOIN resolve
  // ----------------------------------------------------------
  async listConversations(clientId: string, page = 1, limit = 20) {
    const canonical = await this.canonical(clientId)

    return this.conversations
      .createQueryBuilder('conv')
      .leftJoinAndSelect('conv.contact', 'contact')
      .where(`conv.client_id IN ${this.familySubquery()}`, { canonical })
      .orderBy('conv.last_message_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()
  }

  // ----------------------------------------------------------
  // Conversas filtradas por canal (ex: só Instagram)
  // ----------------------------------------------------------
  async listConversationsByChannel(
    clientId: string,
    channel: string,
    page = 1,
    limit = 20,
  ) {
    const canonical = await this.canonical(clientId)

    return this.conversations
      .createQueryBuilder('conv')
      .leftJoinAndSelect('conv.contact', 'contact')
      .where(`conv.client_id IN ${this.familySubquery()}`, { canonical })
      .andWhere('conv.channel = :channel', { channel })
      .orderBy('conv.last_message_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()
  }

  // ----------------------------------------------------------
  // Conversas de um contato específico (socialMediaId / token)
  // usa idx_conv_contact
  // ----------------------------------------------------------
  async listConversationsByContact(
    contactId: string,
    page = 1,
    limit = 20,
  ) {
    return this.conversations
      .createQueryBuilder('conv')
      .leftJoinAndSelect('conv.contact', 'contact')
      .where('conv.contact_id = :contactId', { contactId })
      .orderBy('conv.last_message_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()
  }

  // ----------------------------------------------------------
  // Mensagens de UMA conversa (paginação simples)
  // usa idx_msg_conv_sent
  // ----------------------------------------------------------
  async listMessages(conversationId: string, page = 1, limit = 50) {
    return this.messages
      .createQueryBuilder('msg')
      .where('msg.conversation_id = :conversationId', { conversationId })
      .orderBy('msg.sent_at', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()
  }

  // ----------------------------------------------------------
  // Histórico unificado: todas as mensagens de TODAS as conversas
  // do cliente, ordenadas por tempo — timeline cross-channel
  // ----------------------------------------------------------
  async listClientHistory(clientId: string, page = 1, limit = 50) {
    const canonical = await this.canonical(clientId)

    return this.messages
      .createQueryBuilder('msg')
      .innerJoin('msg.conversation', 'conv')
      .addSelect(['conv.id', 'conv.channel', 'conv.contactId'])
      .where(`conv.client_id IN ${this.familySubquery()}`, { canonical })
      .orderBy('msg.sent_at', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()
  }

  // ----------------------------------------------------------
  // MERGE — leve: só toca clients (2 rows) + contacts (poucos)
  // Conversations e Messages NUNCA são modificadas
  // ----------------------------------------------------------
  async mergeClients(winnerId: string, loserId: string, mergedBy?: string) {
    if (winnerId === loserId) throw new Error('winner e loser não podem ser iguais')

    const winner = await this.clients.findOneOrFail({ where: { id: winnerId } })
    if (winner.mergedInto) throw new Error('winner já foi absorvido por outro cliente')

    const loser = await this.clients.findOneOrFail({ where: { id: loserId } })
    if (loser.mergedInto) throw new Error('loser já foi absorvido — use o canonical')

    await this.ds.transaction(async manager => {
      // 1. move contatos do loser → winner (poucos registros)
      await manager
        .createQueryBuilder()
        .update(Contact)
        .set({ clientId: winnerId })
        .where('client_id = :loserId', { loserId })
        .execute()

      // 2. marca loser como absorvido (1 row)
      await manager
        .createQueryBuilder()
        .update(Client)
        .set({ mergedInto: winnerId })
        .where('id = :loserId', { loserId })
        .execute()

      // 3. achata cadeia — quem apontava pro loser agora aponta
      //    direto pro winner (garante que nunca existe A→B→C)
      await manager
        .createQueryBuilder()
        .update(Client)
        .set({ mergedInto: winnerId })
        .where('merged_into = :loserId', { loserId })
        .execute()

      // 4. audit log
      await manager.insert(ClientMerge, {
        winnerId,
        loserId,
        mergedBy: mergedBy ?? null,
      })
    })

    return { winnerId, loserId }
  }
}