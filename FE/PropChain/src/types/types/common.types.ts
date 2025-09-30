import { AxiosError } from 'axios';

export type CustomAxiosErrorType = AxiosError<{
  message: string;
}>;

export interface PropertyData {
  property: string;
  address: string;
  [key: string]: string;
}

export interface BoughtPropertyData extends PropertyData {
  purchasePrice: string;
  purchaseDate: string;
}

export interface SoldPropertyData extends PropertyData {
  salePrice: string;
  saleDate: string;
  buyer: string;
}
