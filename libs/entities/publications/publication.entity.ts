import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'publications' })
export class PublicationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: false, unique: true })
  title: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  content: string;

  @Column({ type: 'varchar', nullable: false, default: '' })
  image: string;

  @Column({ type: 'varchar', name: 'author_id', nullable: false })
  authorId: string;

  @Column({ type: 'boolean', name: 'is_published', default: false })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}
