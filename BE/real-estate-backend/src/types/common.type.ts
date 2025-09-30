export enum Role {
  BUYER = 'buyer',
  SELLER = 'seller',
}

export interface GenerateOTPOptions {
  digits: boolean;
  lowerCaseAlphabets: boolean;
  upperCaseAlphabets: boolean;
  specialChars: boolean;
}

export interface JWT {
  id: number;
  email: string;
  walletAddress: string;
}
