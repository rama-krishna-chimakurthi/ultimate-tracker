import { Repository } from "typeorm";
import { PasswordEntity } from "../entities/PasswordEntity";

export class PasswordRepo {
    private repo: Repository<PasswordEntity>

    constructor(repo: Repository<PasswordEntity>) {
        this.repo = repo
    }

    async create(password: PasswordEntity): Promise<PasswordEntity> {
        return await this.repo.save(password)
    }

    async getAll(): Promise<PasswordEntity[]> {
        return await this.repo.find()
    }

    async getById(id: number): Promise<PasswordEntity> {
        return await this.repo.findOne({
            where: {
                id: id
            }
        });
    }


    async update(password: PasswordEntity): Promise<PasswordEntity> {
        return await this.repo.save(password)
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id)
    }
}