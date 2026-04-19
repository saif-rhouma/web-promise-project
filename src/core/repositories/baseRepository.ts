import { DeepPartial, FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

class BaseRepository<T extends ObjectLiteral> {
  protected repo: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repo = repository;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repo.find(options);
  }

  // ======================
  // FIND ONE (SAFE)
  // ======================
  async findOne(options: { where: FindOptionsWhere<T>; relations?: string[] }): Promise<T | null> {
    return this.repo.findOne(options);
  }

  async update(id: string | number, data: DeepPartial<T>): Promise<T | null> {
    const entity = await this.repo.findOneBy({ id } as any);
    if (!entity) return null;

    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  // ======================
  // DELETE
  // ======================
  async destroy(id: string | number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return !!result.affected;
  }

  // ======================
  // SAVE (FIXED)
  // ======================
  async save(entity: DeepPartial<T>): Promise<T> {
    return this.repo.save(entity);
  }
}

export default BaseRepository;
