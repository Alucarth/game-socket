import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Round {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
