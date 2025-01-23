import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WalletData } from "../types";

interface PortfolioDistributionCardProps {
  portfolio: WalletData["portfolio"];
  totalValue: number;
}

export function PortfolioDistributionCard({
  portfolio,
  totalValue,
}: PortfolioDistributionCardProps) {
  return (
    <Card className="bg-white dark:bg-neutral-950">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-neutral-50">
          Portfolio Distribution
        </CardTitle>
        <CardDescription>Asset allocation breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {portfolio.map((token, index) => (
            <div key={token.symbol} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="capitalize text-neutral-50 dark:text-neutral-900">
                  {token.name}
                </span>
                <span className="text-neutral-900 font-semibold dark:text-neutral-50">
                  {((token.value / totalValue) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
                <motion.div
                  className="h-full rounded-full bg-neutral-900 dark:bg-neutral-50"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(token.value / totalValue) * 100}%`,
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
