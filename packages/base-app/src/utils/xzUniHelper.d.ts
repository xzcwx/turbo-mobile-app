// @ts-ignore
export type NodeField = UniNamespace.NodeField;

// @ts-ignore
export interface NodeInfo extends UniNamespace.NodeInfo {
  width: number;
  height: number;
}

export interface ConfirmHintOpts {
  title: string;
  message: string;
  confirmBtnText?: string;
  cancelBtnText?: string;
  showCancel?: boolean;
}

export interface JointUrl {
  url?: string;
  query?: Record<string, unknown>;
  allownull?: boolean;
  onlyquery?: boolean;
}

export interface RouterPush {
  query?: Record<string, unknown>;
  replace?: boolean;
}

export interface RouterDerive {
  base?: string;
}
