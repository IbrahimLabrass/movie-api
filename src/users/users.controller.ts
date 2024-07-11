import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':username')
  async findOne(@Param('username') username: string): Promise<User> {
    return this.usersService.findOneByUsername(username);
  }
}
