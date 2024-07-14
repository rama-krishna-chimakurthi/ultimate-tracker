import { Repository } from "typeorm";
import { FinanceAssetGroup } from "../entities/FinanceAssetGroup";

export class FinanceAssetGroupRepo {
    private repo: Repository<FinanceAssetGroup>

    constructor(repo: Repository<FinanceAssetGroup>) {
        this.repo = repo;
    }

    async getAll(): Promise<FinanceAssetGroup[]> {
        return await this.repo.find({ where: { isDeleted: false } });
    }

    async create(assetGroup: FinanceAssetGroup): Promise<FinanceAssetGroup> {
        return await this.repo.save(assetGroup);
    }

    async update(assetGroup: FinanceAssetGroup): Promise<FinanceAssetGroup> {
        return await this.repo.save(assetGroup);
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    async findById(id: number): Promise<FinanceAssetGroup | undefined> {
        return await this.repo.findOne({ where: { id } });
    }


}