import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ReputationCardProps {
  score: number;
}

export function ReputationCard({ score }: ReputationCardProps) {
  return (
    <Card className="bg-white dark:bg-neutral-950">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-neutral-50">
          Reputation Score
        </CardTitle>
        <CardDescription>
          Overall trustworthiness based on activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          className="flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="relative h-40 w-40">
            <svg className="h-full w-full" viewBox="0 100">
              <circle
                className="stroke-muted"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="10"
              />
              <motion.circle
                className="stroke-primary"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="10"
                strokeDasharray="283"
                strokeDashoffset="283"
                transform="rotate(-90 50 50)"
                initial={{ strokeDashoffset: 283 }}
                animate={{
                  strokeDashoffset: 283 - (score / 100) * 283,
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              <text
                x="50"
                y="50"
                className="fill-primary text-xl font-bold"
                dominantBaseline="middle"
                textAnchor="middle"
              >
                {score}%
              </text>
            </svg>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
