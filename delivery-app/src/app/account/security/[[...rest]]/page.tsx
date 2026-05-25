"use client";

import { UserProfile } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SecurityPage() {
  const router = useRouter();

  return (
    <main className="pax-4 py-10">
      <div className="flex justify-center py-10">
        <Button
          onClick={() => router.push("/account")}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Button>
      </div>
      <div className="flex justify-center">
        <UserProfile />
      </div>
    </main>
  );
}
