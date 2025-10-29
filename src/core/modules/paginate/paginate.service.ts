import { z, ZodError } from 'nestjs-zod/z';
import { Injectable } from '@nestjs/common';
import {
  type ObjectLiteral,
  Repository,
  type FindManyOptions,
  SelectQueryBuilder,
} from 'typeorm';
import { BadRequestError } from '@/interceptors/badRequestError.interceptor';
import { cleanReturned } from '@/common/types/returned.type';

const paginationParamSchema = z
  .union([z.string(), z.number()])
  .refine(value => {
    if (value) {
      if (typeof value === 'string') {
        const numberfyedValue = +value;

        return !Number.isNaN(numberfyedValue);
      }

      return true;
    }
    return true;
  })
  .transform(Number);

@Injectable()
export class PaginationService {
  private resolveOptions(options: IPaginationOptions) {
    try {
      const page = paginationParamSchema.default(1).parse(options.page);
      const limit = paginationParamSchema.default(10).parse(options.limit);
      const countQueries =
        typeof options.countQueries !== 'undefined'
          ? options.countQueries
          : true;
      const cacheQueries = options.cacheQueries || false;

      return { page, limit, countQueries, cacheQueries };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestError();
      }

      throw new Error(error);
    }
  }

  public async paginateOld<T extends ObjectLiteral>(
    entityRepository: Repository<T>,
    options: IPaginationOptions,
    searchOptions?: FindManyOptions<T>,
  ): Promise<Pagination<T>> {
    const { limit, page, countQueries } = this.resolveOptions(options);

    const promises: [Promise<T[]>, Promise<number> | undefined] = [
      entityRepository.find({
        skip: limit * (page - 1),
        take: limit,
        ...searchOptions,
      }),
      undefined,
    ];

    if (countQueries) {
      promises[1] = entityRepository.count({
        ...searchOptions,
      });
    }

    const [items, total] = await Promise.all(promises);
    const totalPages = Math.ceil(items.length / limit) || undefined;

    return {
      items: cleanReturned(items),
      meta: {
        currentPage: page,
        itemCount: items.length,
        itemsPerPage: limit,
        totalItems: total,
        totalPages,
        hasNext: page < totalPages,
      },
    };
  }
  public async paginate<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationOptions,
  ): Promise<Pagination<T>> {
    const { limit, page } = this.resolveOptions(options);

    const [items, total] = await queryBuilder
      .skip((Number(page) - 1) * Number(limit))
      .take(Number(limit))
      .getManyAndCount();
    console.log([items, total]);
    const totalPages = Math.ceil(total / Number(limit));

    return {
      items: cleanReturned(items),
      meta: {
        currentPage: page,
        itemCount: items.length,
        itemsPerPage: limit,
        totalItems: total,
        totalPages,
        hasNext: page < totalPages,
      },
    };
  }
}
