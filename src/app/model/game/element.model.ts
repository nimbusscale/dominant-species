export type ElementKind =
  | 'grassElement'
  | 'grubElement'
  | 'meatElement'
  | 'seedElement'
  | 'sunElement'
  | 'waterElement';

export interface Element {
  kind: ElementKind;
}
