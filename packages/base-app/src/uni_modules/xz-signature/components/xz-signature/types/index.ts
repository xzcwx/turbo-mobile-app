import type { ComponentInternalInstance } from "vue";


export type CanvasType = "auto" | "native" | "2d";

export type UniCanvasContext = UniNamespace.CanvasContext;

export type UniCanvasContext2D = CanvasRenderingContext2D;

export type SignatureCanvasCtx =
  UniCanvasContext
  | UniCanvasContext2D
  | Promise<UniCanvasContext2D>;

export type UniTouchEvent =
  TouchEvent
  & { touches: (Touch & { x: number; y: number })[] };

export interface UniCanvasElement extends HTMLCanvasElement {
  createImage: () => HTMLImageElement & { onload: () => void };
}

//export interface Signature2DCtx {canvas: HTMLCanvasElement; ctx: UniCanvasContext2D}

export interface SignatureConfs {
  self: ComponentInternalInstance;
  uidCanvas: string | number;
  fileType: "png" | "jepg";
  hd?: boolean;
  // 签名样式
  style?: {
    penColor?: string;
    lineWidth?: number;
  };
}

export namespace DrawImage {
  export type resource = string;
  export type direction = "left" | "right" | number;
  export type origin = [number, number];
}
