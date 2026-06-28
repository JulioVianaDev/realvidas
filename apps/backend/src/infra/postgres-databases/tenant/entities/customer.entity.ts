import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { BrState } from '@global-types/entities/customer.entity-type';

/**
 * B2B customer ("Cliente") stored in the tenant database. Columns mirror the
 * customer registration form.
 */
@Entity('customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  razaoSocial: string;

  @Column({ type: 'varchar', nullable: true })
  nomeFantasia: string | null;

  @Column({ type: 'varchar', nullable: true })
  cnpjCpf: string | null;

  @Column({ type: 'varchar', nullable: true })
  responsavel: string | null;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Column({ type: 'varchar', nullable: true })
  telefone: string | null;

  @Column({ type: 'varchar', nullable: true })
  celular: string | null;

  /** ISO2 country code of the phone (e.g. "br") — drives the flag in the UI. */
  @Column({ name: 'phone_country', type: 'varchar', nullable: true })
  phoneCountry: string | null;

  @Column({ type: 'varchar', nullable: true })
  endereco: string | null;

  @Column({ type: 'varchar', nullable: true })
  complemento: string | null;

  @Column({ type: 'varchar', nullable: true })
  bairro: string | null;

  @Column({ type: 'varchar', nullable: true })
  cidade: string | null;

  @Column({ type: 'varchar', nullable: true })
  cep: string | null;

  @Column({ type: 'varchar', length: 2, nullable: true })
  estado: BrState | null;

  @Column({ type: 'int', nullable: true })
  limiteTolerancia: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
