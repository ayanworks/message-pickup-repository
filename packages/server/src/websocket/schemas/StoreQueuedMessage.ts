import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('store_queued_message')
export class StoreQueuedMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Auto-generated UUID as the primary key

  @Column({ type: 'varchar', nullable: false })
  messageId: string;

  @Column({ type: 'varchar', nullable: true })
  connectionId: string;

  // Store array as JSON string for SQLite compatibility
  @Column({ type: 'text', nullable: true })
  recipientKeys: string; // Serialized JSON string of keys

  @Column({ type: 'text', nullable: false })
  encryptedMessage: string; // Serialized JSON string of encrypted message

  @Column({ type: 'int', nullable: true })
  encryptedMessageByteCount: number;

  @Column({ type: 'varchar', nullable: false })
  state: string;

  @Column({ type: 'datetime', nullable: false })
  createdAt: Date;
}