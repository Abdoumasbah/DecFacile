export class Sense {
  id: string = '';
  referredEntity: string = '';
  label: string = '';
  pos: string[] = [];
  children: Sense[] = [];

  // Convertit un objet JSON en une instance de Sense
  static fromJson(json: any): Sense {
    const sense = Object.assign(new Sense(), json);
    sense.children = (json.children || []).map((child: any) => Sense.fromJson(child));
    return sense;
  }

  // Sérialise une instance de Sense en JSON
  toJson(): any {
    return {
      id: this.id,
      referredEntity: this.referredEntity,
      label: this.label,
      pos: [...this.pos],
      children: this.children.map(child => child.toJson())
    };
  }
}
