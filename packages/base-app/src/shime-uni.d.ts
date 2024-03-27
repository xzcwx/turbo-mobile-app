export {}

declare module "vue" {
  type Hooks = App.AppInstance & Page.PageInstance;
  interface ComponentCustomOptions extends Hooks {}
}

declare interface UnknownObject<T = unknown> {
  [key: string]: T;
}
