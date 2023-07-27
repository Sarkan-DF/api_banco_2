import { Database } from "../database/config/database.conection";
import { ErrandEntity } from "../database/entities/errand.entity";
import { Errands } from "../models/errands.models";
import { UserRepository } from "./user.repository";

interface ListTransactionsParams {
  idUser: string;
}
export class ErradsReposity {
  private repository = Database.connection.getRepository(ErrandEntity);

  public async create(errand: Errands) {
    const ErrandEntity = await this.repository.create({
      idErrands: errand.idErrands,
      title: errand.title,
      description: errand.description,
      idUser: errand.user.idUser,
    });

    await this.repository.save(ErrandEntity);
    const result = await this.repository.findOne({
      where: { idErrands: errand.idErrands },
      relations: { user: true },
    });
    return this.mapRowToModel(result!);
  }

  public async list(paramas: ListTransactionsParams) {
    const result = await this.repository.find({
      where: { idUser: paramas.idUser },
      relations: { user: true },
    });

    return result.map((row) => this.mapRowToModel(row));
  }

  public async getByIdUser(idUser: string) {
    const result = await this.repository.findOneBy({ idUser });

    if (!result) {
      return undefined;
    }

    return this.mapRowToModel(result);
  }

  public mapRowToModel(entity: ErrandEntity) {
    const user = UserRepository.mapRowToModel(entity.user);
    return Errands.create(entity, user);
  }
}
