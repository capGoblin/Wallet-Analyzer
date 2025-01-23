export interface TransactionData {
  date: string;
  volume: number;
}

export interface TokenData {
  date: string;
  price: number;
}

export interface WalletData {
  reputationScore: number;
  portfolio: {
    name: string;
    symbol: string;
    balance: number;
    price: number;
    value: number;
    predictions: TokenData[];
  }[];
  totalValue: number;
}
