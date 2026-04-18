import { DeepPartial, ObjectLiteral, Repository } from 'typeorm';

class BaseRepository<T extends ObjectLiteral> {
  protected repo: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repo = repository;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findAll(): Promise<T[]> {
    return this.repo.find();
  }

  async findOne(id: number | string): Promise<T | null> {
    return this.repo.findOneBy({ id } as any);
  }

  async update(id: number, data: DeepPartial<T>): Promise<T | null> {
    const entity = await this.findOne(id);
    if (!entity) return null;

    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async destroy(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}

export default BaseRepository;
