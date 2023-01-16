function addPmComponent<T extends IPmComponent>(entity: IEntity, component: T): T {

  component.addToEntity(entity);
  if (entity.hasComponent(component["__name__symbol_"])) {
    return component;
  }
  entity.addComponent(component)
  return component;
}

function removePmComponent<T extends IPmComponent>(entity: IEntity, component: T) {

  if (!entity.hasComponent(component["__name__symbol_"])) {
    return;
  }
  component.removeFromEntity(entity);
  if (entity.hasComponent(component["__name__symbol_"])) {
    entity.removeComponent(component);
  }

}


interface IPmComponent {
  entity: IEntity
  entities?: IEntity[]
  addToEntity(entity: IEntity): void
  removeFromEntity(entity: IEntity): void
}

class PmComponent implements IPmComponent {
  entity: IEntity
  entities: IEntity[] = []
  addToEntity(entity: IEntity): void {
    if (indexOfEntity(this.entities, entity) == 1) {
      this.entities.push(entity);
    }
  }
  removeFromEntity(entity: IEntity): void {
    const index = indexOfEntity(this.entities, entity);
    if (index !== -1) this.entities.splice(index, 1);
  }
}