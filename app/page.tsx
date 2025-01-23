"use client";

import dynamic from "next/dynamic";

const WalletAnalyzer = dynamic(() => import("@/components/wallet-analyzer"), {
  ssr: false,
});

export default function Home() {
  return <WalletAnalyzer />;
}
