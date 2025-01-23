"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ReputationCard } from "../components/wallet/reputation-card";
import { PortfolioDistributionCard } from "../components/wallet/portfolio-distribution-card";
import { initialWalletData } from "../lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TokenBalance {
  token_name: string;
  token_symbol: string;
  quantity: number;
  decimal: number;
  token_address: string;
}

interface TokenMetrics {
  current_price: number;
  token_name: string;
  token_symbol: string;
  token_address: string;
}

interface MetricsResponse {
  data: {
    current_price: number;
    token_name: string;
    token_symbol: string;
    token_address: string;
  }[];
}

interface ApiResponse {
  data: TokenBalance[];
  pagination: {
    has_next: boolean;
    limit: number;
    offset: number;
    total_items: number;
  };
}

interface NftAnalytics {
  nft_bought: number;
  nft_sold: number;
  nft_mint: number;
  nft_transfer: number;
  nft_burn: number;
  transactions: number;
  transfers: number;
  volume: number;
}

interface NftApiResponse {
  data: NftAnalytics[];
}

interface ReputationResponse {
  wallet: {
    metric_values: {
      risk_interaction_score: {
        value: string;
        unit: string;
      };
    };
  };
}

interface AnalysisProps {
  walletAddress: string;
}

export default function Analysis({ walletAddress }: AnalysisProps) {
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  const [nftData, setNftData] = useState<NftAnalytics | null>(null);
  const [reputationScore, setReputationScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset states when wallet changes
    setTokenBalances([]);
    setTokenPrices({});
    setNftData(null);
    setReputationScore(0);
    setIsLoading(true);

    const fetchData = async () => {
      if (!walletAddress) return;

      if (!process.env.NEXT_PUBLIC_UNLEASH_API_KEY) {
        console.error("API key not found");
        return;
      }

      const headers = {
        accept: "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_UNLEASH_API_KEY,
      };

      try {
        // Fetch reputation score
        const reputationResponse = await fetch(
          `https://api.unleashnfts.com/api/v1/wallet/1/${walletAddress}/score/reputation?metrics=risk_interaction_score`,
          { headers }
        );
        const reputationData: ReputationResponse =
          await reputationResponse.json();
        const riskScore = parseInt(
          reputationData.wallet.metric_values.risk_interaction_score.value
        );
        setReputationScore(100 - riskScore);

        // Fetch token balances
        const response = await fetch(
          `https://api.unleashnfts.com/api/v2/wallet/balance/token?address=${walletAddress}&blockchain=ethereum&time_range=all&offset=0&limit=30`,
          { headers }
        );
        const data: ApiResponse = await response.json();
        setTokenBalances(data.data);

        // Fetch NFT analytics
        const nftResponse = await fetch(
          `https://api.unleashnfts.com/api/v2/nft/wallet/analytics?wallet=${walletAddress}&blockchain=ethereum&time_range=all&sort_by=volume&sort_order=desc&offset=0&limit=30`,
          { headers }
        );
        const nftResponseData: NftApiResponse = await nftResponse.json();
        if (nftResponseData.data && nftResponseData.data.length > 0) {
          setNftData(nftResponseData.data[0]);
        }

        // Fetch token prices
        const prices: Record<string, number> = {};
        for (const token of data.data) {
          try {
            console.log(
              `Fetching price for token: ${token.token_symbol} (${token.token_address})`
            );
            const metricsResponse = await fetch(
              `https://api.unleashnfts.com/api/v2/token/metrics?blockchain=ethereum&token_address=${token.token_address}&offset=0&limit=30`,
              { headers }
            );
            const metricsData: MetricsResponse = await metricsResponse.json();
            console.log("Metrics response:", metricsData);

            if (metricsData.data && metricsData.data.length > 0) {
              const price = metricsData.data[0].current_price;
              prices[token.token_address] = price;
              console.log(`Set price for ${token.token_symbol}: ${price}`);
            } else {
              console.log(`No price data found for ${token.token_symbol}`);
            }
          } catch (error) {
            console.error(
              `Error fetching price for token ${token.token_symbol}:`,
              error
            );
          }
        }

        console.log("Final prices object:", prices);
        setTokenPrices(prices);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [walletAddress]);

  // Transform API data to match the format needed for the table
  const transformedPortfolio = tokenBalances.map((token) => {
    const price = tokenPrices[token.token_address] || 0;
    const value = token.quantity * price;
    console.log(
      `Transforming ${token.token_symbol}: price=${price}, quantity=${token.quantity}, value=${value}, address=${token.token_address}`
    );
    return {
      name: token.token_name,
      symbol: token.token_symbol,
      balance: token.quantity,
      price: price,
      value: value,
      predictions: initialWalletData.portfolio[0].predictions,
    };
  });

  const totalValue = transformedPortfolio.reduce((sum, token) => {
    console.log(`Adding to total: ${token.symbol} value=${token.value}`);
    return sum + token.value;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* First row: 4 equal cards */}
        <ReputationCard score={reputationScore} />
        <PortfolioDistributionCard
          portfolio={transformedPortfolio}
          totalValue={totalValue}
        />

        {/* Token Price Predictions Card */}
        <Card className="bg-white col-span-2 dark:bg-neutral-950">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-50">
              Token Price Predictions
            </CardTitle>
            <CardDescription>
              Estimated future prices for owned tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={initialWalletData.portfolio[0].predictions}>
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--primary-foreground))"
                  />
                  <YAxis
                    stroke="hsl(var(--primary-foreground))"
                    tick={{ fill: "hsl(var(--primary))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "4px",
                      color: "hsl(var(--primary-foreground))",
                    }}
                    labelStyle={{
                      color: "hsl(var(--primary-foreground))",
                    }}
                  />
                  {transformedPortfolio.map((token, index) => (
                    <Line
                      key={token.symbol}
                      type="monotone"
                      data={token.predictions}
                      dataKey="price"
                      name={token.name}
                      stroke={`hsl(${index * 60}, 70%, 50%)`}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Second row: Combined NFT Analytics and Token Holdings */}
        <Card className="bg-white col-span-2 dark:bg-neutral-950">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-50">
              NFT Analytics
            </CardTitle>
            <CardDescription>
              Comprehensive NFT activity overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading NFT data...</p>
            ) : (
              <div className="space-y-6">
                {/* NFT Activity Overview */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Total Transactions
                    </p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                      {nftData?.transactions || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Total Transfers
                    </p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                      {nftData?.transfers || 0}
                    </p>
                  </div>
                </div>

                {/* NFT Transaction Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Bought
                    </p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                      {nftData?.nft_bought || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Sold
                    </p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                      {nftData?.nft_sold || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Minted
                    </p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                      {nftData?.nft_mint || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Burned
                    </p>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                      {nftData?.nft_burn || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Token Holdings Card */}
        <Card className="bg-white col-span-2 dark:bg-neutral-950">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-50">
              Token Holdings
            </CardTitle>
            <CardDescription>
              Current balance and value of owned tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {isLoading ? (
                <p>Loading wallet data...</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800">
                      <th className="text-left p-2">Token</th>
                      <th className="text-right p-2">Balance</th>
                      <th className="text-right p-2">Price</th>
                      <th className="text-right p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transformedPortfolio.map((token) => (
                      <tr
                        key={token.symbol}
                        className="border-b border-neutral-200 dark:border-neutral-800"
                      >
                        <td className="p-2">
                          {token.name} ({token.symbol})
                        </td>
                        <td className="text-right p-2">
                          {token.balance.toFixed(4)}
                        </td>
                        <td className="text-right p-2">
                          ${token.price.toFixed(2)}
                        </td>
                        <td className="text-right p-2">
                          ${token.value.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td colSpan={3} className="text-right p-2">
                        Estimated Net Worth:
                      </td>
                      <td className="text-right p-2 text-neutral-900 dark:text-neutral-50">
                        ${totalValue.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
