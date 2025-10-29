import { NotFoundException } from '@nestjs/common';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { cleanReturned } from '../types/returned.type';

export abstract class BaseService<Entity = any> {
  protected repository: Repository<Entity>;

  async findAll(options?: FindOneOptions<Entity>['where']) {
    return cleanReturned(
      await this.repository.find({
        where: {
          ...options,
        } as any,
      }),
    );
  }

  async findBy(options: FindOneOptions<Entity>['where']) {
    return cleanReturned(await this.repository.findBy(options));
  }
  async findOneBy(options: FindOneOptions<Entity>['where']) {
    try {
      const data = await this.repository.findOneOrFail({
        where: {
          ...options,
        },
      });
      return cleanReturned(data);
    } catch (err) {
      throw new NotFoundException('Entity not found');
    }
  }

  async store(data: Entity) {
    const details = this.repository.create(data);
    return cleanReturned(await this.repository.save(details));
  }
  async update(uuid: string, data: DeepPartial<Entity>) {
    const details = await this.repository.findOneBy({ uuid } as any);
    this.repository.merge(details, data);
    return cleanReturned(await this.repository.save(details));
  }

  async remove(uuid: string) {
    const entity = (await this.repository.findOneOrFail({
      where: { uuid } as any,
    })) as Record<string, any>;

    await this.repository.softDelete({ id: entity.id });
  }

  async destroy(uuid: string) {
    const entity = (await this.repository.findOneOrFail({
      where: { uuid } as any,
    })) as Record<string, any>;

    await this.repository.delete({
      id: entity.id,
    });
  }
}
