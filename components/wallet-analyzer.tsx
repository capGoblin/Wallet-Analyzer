"use client";

import { useState } from "react";
import { Search, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type TransactionData, type WalletData, TokenData } from "./types";
import { ReputationCard } from "@/components/wallet/reputation-card";
import { TransactionVolumeCard } from "@/components/wallet/transaction-volume-card";
import { PortfolioDistributionCard } from "@/components/wallet/portfolio-distribution-card";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import Analysis from "./analysis";

// Mock data (same as before)
const initialTransactionData: TransactionData[] = [
  { date: "2023-01", volume: 65 },
  { date: "2023-02", volume: 85 },
  { date: "2023-03", volume: 45 },
  { date: "2023-04", volume: 75 },
  { date: "2023-05", volume: 55 },
  { date: "2023-06", volume: 95 },
];

const initialWalletData: WalletData = {
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

export default function WalletAnalyzer() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [searchedAddress, setSearchedAddress] = useState<string>("");
  const { connectors, connect, isPending } = useConnect();
  const { isConnected, address: connectedAddress } = useAccount();
  const { disconnect } = useDisconnect();

  const handleConnectWallet = async () => {
    setError(null);
    try {
      await connect({ connector: connectors[0] });
      setSearchedAddress(""); // Clear searched address when connecting wallet
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    }
  };

  const handleDisconnectWallet = () => {
    disconnect();
    setShowAnalysis(false);
  };

  const handleSearchWallet = async () => {
    if (!address) {
      setError("Please enter a wallet address");
      return;
    }

    // Check if it's a valid Ethereum address
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethereumAddressRegex.test(address)) {
      setError("Please enter a valid Ethereum wallet address");
      return;
    }

    setError(null);
    try {
      setSearchedAddress(address);
      setShowAnalysis(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search wallet");
    }
  };

  // Get the active wallet address (either connected or searched)
  const activeWalletAddress = connectedAddress || searchedAddress;

  return (
    <div className="min-h-screen bg-white text-neutral-50 dark dark:bg-neutral-950 dark:text-neutral-900">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
            Unleash Wallet Analyzer
          </h1>
          {isConnected ? (
            <div className="flex items-center gap-4">
              <p className="text-sm text-neutral-500">
                Connected: {connectedAddress?.slice(0, 6)}...
                {connectedAddress?.slice(-4)}
              </p>
              <Button onClick={handleDisconnectWallet}>
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <Button onClick={handleConnectWallet} disabled={isPending}>
              <Wallet className="mr-2 h-4 w-4" />
              {isPending ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4">
        {(isConnected || showAnalysis) && activeWalletAddress ? (
          <>
            {searchedAddress && (
              <div className="mb-4 flex items-center justify-between bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg">
                <p className="text-sm text-neutral-500">
                  Analyzing wallet: {searchedAddress.slice(0, 6)}...
                  {searchedAddress.slice(-4)}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchedAddress("");
                    setShowAnalysis(false);
                    setAddress("");
                  }}
                >
                  Clear
                </Button>
              </div>
            )}
            <Analysis walletAddress={activeWalletAddress} />
          </>
        ) : (
          <motion.div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4 dark:text-neutral-50">
              Welcome to Wallet Analyzer
            </h2>
            <p className="text-xl text-center mb-8 text-neutral-900 dark:text-neutral-50">
              Connect your wallet or search an address to view analytics.
            </p>
            <div className="w-full max-w-md flex flex-col gap-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter wallet address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Button onClick={handleSearchWallet}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {error && (
              <motion.div className="mt-4 rounded-md bg-red-500/15 p-3">
                {error}
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
