import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'event_id' })
  event_id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'question_id' })
  question_id: number;

  @Column({ name: 'question_option_id' })
  question_option_id: number;

  @Column({ nullable: true, name: 'score' })
  score: number;
}
