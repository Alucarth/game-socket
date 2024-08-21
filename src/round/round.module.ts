import { Module } from '@nestjs/common';
import { RoundService } from './round.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round } from './entities/round.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Round])],
  providers: [RoundService],
  exports: [RoundService],
})
export class RoundModule {}
