import * as BIZ from '@/types/business';

export interface ITableRowOptions {
  row: BIZ.IMedCase;
  rowIndex: number;
}

export interface DialogStateType {
  mode: '' | 'delete' | 'archive';
  confirmVisible: boolean;
  selectedIndex: number;
  confirmSuccess: () => void;
}
