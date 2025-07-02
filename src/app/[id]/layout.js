import React, { Suspense } from "react";

export default function Layout({ children }) {
  return <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}>{children}</Suspense>;
}
