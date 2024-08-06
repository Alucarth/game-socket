import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUser(_client: User) {
    let user = await this.userRepository.findOneBy({ uuid: _client.uuid });

    console.log('user', user);
    if (!user) {
      user = await this.userRepository.save(_client);
    }
    return user;
  }
}
