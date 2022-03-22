export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  favorite?: any;
  isSelected?: boolean;
  ignore?: boolean;
}
