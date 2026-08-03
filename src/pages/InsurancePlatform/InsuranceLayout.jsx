import { Outlet } from "react-router-dom";

import { PlatformSidebar } from "../../components/PlatformSidebar";

import Dashboard from "./index";
import Policies from "./policies";
import Claims from "./claims";
import RiskEngine from "./riskEngine";
import Reports from "./reports";

export default function InsuranceLayout() {
  return (
    <div className="flex min-h-screen bg-[#050B14]">
      <PlatformSidebar />

      <main className="ml-[84px] flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}