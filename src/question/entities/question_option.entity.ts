import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class QuestionOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'question_id' })
  question_id: number;

  @Column({ default: false })
  is_correct: boolean;
}
