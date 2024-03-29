import { Repository, Not } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import User from '../entities/User';
import { PgDataSource } from '@shared/infra/typeorm';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = PgDataSource.getRepository(User);
  }

  public async findById(id: string): Promise<User | null> {
    const user = await this.ormRepository.findOneBy({ id });
    return user;
  };

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.ormRepository.findOneBy({ email })
    return user;
  };

  public async findAllProviders({except_user_id}: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id)
        }
      });
    } else {
      users = await this.ormRepository.find();
    }

    return users;
  }


  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
