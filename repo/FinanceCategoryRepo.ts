import { Repository } from "typeorm";
import { FinanceCategory } from "../entities/FinanceCategory";

export class FinanceCategoryRepo {
    private repo: Repository<FinanceCategory>

    constructor(repo: Repository<FinanceCategory>) {
        this.repo = repo;
    }

    async findAll(): Promise<FinanceCategory[]> {
        return await this.repo.find();
    }

    async findOneById(id: number): Promise<FinanceCategory | undefined> {
        return await this.repo.findOne({
            where: { id: id }
        });
    }

    async create(category: FinanceCategory): Promise<FinanceCategory> {
        return await this.repo.save(category);
    }

    async update(category: FinanceCategory): Promise<FinanceCategory> {
        return await this.repo.save(category);
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}