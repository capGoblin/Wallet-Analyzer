import { TransactionData, WalletData } from "../components/types";

export const initialTransactionData: TransactionData[] = [
  { date: "2023-01", volume: 65 },
  { date: "2023-02", volume: 85 },
  { date: "2023-03", volume: 45 },
  { date: "2023-04", volume: 75 },
  { date: "2023-05", volume: 55 },
  { date: "2023-06", volume: 95 },
];

export const initialWalletData: WalletData = {
  reputationScore: 85,
  portfolio: [
    {
      name: "Ethereum",
      symbol: "ETH",
      balance: 2.5,
      price: 2000,
      value: 5000,
      predictions: [
        { date: "2023-07", price: 2100 },
        { date: "2023-08", price: 2200 },
        { date: "2023-09", price: 2300 },
        { date: "2023-10", price: 2400 },
      ],
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      balance: 0.1,
      price: 30000,
      value: 3000,
      predictions: [
        { date: "2023-07", price: 31000 },
        { date: "2023-08", price: 32000 },
        { date: "2023-09", price: 33000 },
        { date: "2023-10", price: 34000 },
      ],
    },
    {
      name: "Cardano",
      symbol: "ADA",
      balance: 1000,
      price: 0.5,
      value: 500,
      predictions: [
        { date: "2023-07", price: 0.55 },
        { date: "2023-08", price: 0.6 },
        { date: "2023-09", price: 0.65 },
        { date: "2023-10", price: 0.7 },
      ],
    },
  ],
  totalValue: 8500,
};
