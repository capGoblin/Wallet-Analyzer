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
        <CardDescription className="text-neutral-500 dark:text-neutral-400">
          Asset allocation breakdown
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {portfolio.map((token, index) => (
            <div key={token.symbol} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-sm text-neutral-900 dark:text-neutral-50">
                    {token.name} ({token.symbol})
                  </div>
                </div>
                <div className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                  {((token.value / totalValue) * 100).toFixed(2)}%
                </div>
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
