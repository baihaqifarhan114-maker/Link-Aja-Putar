"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function BerkahRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/siklus"); }, [router]);
  return null;
}
