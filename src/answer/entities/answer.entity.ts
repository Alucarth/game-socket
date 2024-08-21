import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'round_id' })
  round_id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'question_id' })
  question_id: number;

  @Column({ name: 'question_option_id' })
  question_option_id: number;

  @Column()
  is_correct: boolean;

  @Column()
  score: number;

  @CreateDateColumn()
  created_at: Date; // Creation date
}
