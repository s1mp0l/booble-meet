export interface ItemDimensions {
  width: number;
  height: number;
}

export interface GridLayout {
  items: ItemDimensions[];
  columns: number;
  rows: number;
} 