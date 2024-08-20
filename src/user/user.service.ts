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
    if (user) {
      if (user.name !== _client.name) {
        user.name = _client.name;
        user = await this.userRepository.save(user);
      }
    }

    console.log('user', user);
    if (!user) {
      user = await this.userRepository.save(_client);
    }
    return user;
  }

  async setAvatar(uuid: string, avatar_id: number) {
    let user = await this.userRepository.findOneBy({ uuid: uuid });
    if (user) {
      user.avatar_id = avatar_id;
      user = await this.userRepository.save(user);
    }
    return user;
  }

  async findByUUID(uuid: string) {
    return await this.userRepository.findOneBy({ uuid: uuid });
  }

  async clearAvatar(uuid: string) {
    const user = await this.userRepository.findOneBy({ uuid: uuid });
    user.avatar_id = null;
    return await this.userRepository.save(user);
  }
}
