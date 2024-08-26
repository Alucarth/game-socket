import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RoundQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'question_id' })
  question_id: number;

  @Column({ name: 'round_id' })
  round_id: number;

  @Column()
  index: number;
}
