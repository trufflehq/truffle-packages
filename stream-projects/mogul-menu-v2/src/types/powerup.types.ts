export interface Component {
  id: string;
  orgId: string;
  moduleId: string;
  packageVersionId: string;
  exportName: string;
  propTypes: any;
}

export interface ComponentRel {
  id: string;
  component: Component;
  props: any;
}

export interface Powerup {
  id: string;
  orgId: string;
  slug: string;
  name: string;
  jsx: string;
  componentRels: ComponentRel[];
}
