import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TransactionData } from "../types";

interface TransactionVolumeCardProps {
  data: TransactionData[];
}

export function TransactionVolumeCard({ data }: TransactionVolumeCardProps) {
  return (
    <Card className="bg-white dark:bg-neutral-950">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-neutral-50">
          Transaction Volume
        </CardTitle>
        <CardDescription>Historical transaction activity</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          className="h-[200px] w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" stroke="hsl(var(--primary-foreground))" />
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
              <Line
                type="monotone"
                dataKey="volume"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}
