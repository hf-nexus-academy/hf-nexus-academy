"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#0A1628",
          color: "#FAF8F3",
          border: "1px solid rgba(201, 169, 97, 0.3)",
        },
      }}
    />
  );
}
