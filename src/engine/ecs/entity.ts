
export type EntityId = number;

export class EntityGenerator {
  private static nextId = 1;
  static generate(): EntityId {
    return this.nextId++;
  }
  static reset() {
    this.nextId = 1;
  }
}
