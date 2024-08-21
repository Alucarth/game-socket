import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Round } from './entities/round.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoundService {
  constructor(
    @InjectRepository(Round)
    private roundRepository: Repository<Round>,
  ) {}

  async createRound() {
    return await this.roundRepository.save({ name: 'Ronda ' });
  }
}
