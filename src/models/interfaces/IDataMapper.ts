export interface IDataMapper<Entity, DALEntity> {
  toEntity(dalEntity: DALEntity): Entity;
  toDalEntity(entity: Entity): DALEntity;
}
