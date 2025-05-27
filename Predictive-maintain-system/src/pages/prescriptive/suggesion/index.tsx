"use client";

import FailureList from "@/components/prescriptive/FailureList";
import PrescriptiveLayout from "../layout";

export default function HomePage() {
  return (
    <PrescriptiveLayout>
      <div className="space-y-8">
        <FailureList />
      </div>
    </PrescriptiveLayout>
  );
}
