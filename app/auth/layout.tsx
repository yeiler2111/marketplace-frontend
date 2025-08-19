"use client";
import LoaderModalProvider from "@/component/modal/LoaderModalProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LoaderModalProvider>{children}</LoaderModalProvider>;
}
