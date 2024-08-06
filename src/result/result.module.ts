import { Module } from '@nestjs/common';
import { ResultService } from './result.service';

@Module({
  providers: [ResultService],
})
export class ResultModule {}
