"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);

  return showDashboard ? (
    <Dashboard />
  ) : (
    <LandingPage onEnter={() => setShowDashboard(true)} />
  );
}
