import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  uuid: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  avatar_id: number;
}
