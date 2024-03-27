import { ComponentPublicInstance } from "vue";

declare type Component = Record<string, ComponentPublicInstance<any>>;

export function useZPaging(getter: () => Component | null) {
  function complete(condition: boolean, { data, total }: { data: unknown[]; total: number }) {
    if (condition) {
      return getter()?.completeByTotal(data, total);
    }
    return getter()?.complete(false);
  }

  function refreshList() {
    getter()?.reload();
  }

  return { refreshList, complete };
}
