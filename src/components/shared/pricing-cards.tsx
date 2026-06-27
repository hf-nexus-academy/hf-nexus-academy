"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CheckoutButton } from "@/components/shared/checkout-button";
import { PRICING_PLANS, CURRENCIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function PricingCards({ showCurrencySwitcher = true }: { showCurrencySwitcher?: boolean }) {
  const [currency, setCurrency] = React.useState<(typeof CURRENCIES)[number]>("USD");

  return (
    <div>
      {showCurrencySwitcher && (
        <div className="flex justify-center mb-10">
          <Select value={currency} onValueChange={(v) => setCurrency(v as typeof currency)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {PRICING_PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "flex flex-col",
              plan.highlighted && "border-gold-500 shadow-lg shadow-gold-500/10 lg:-translate-y-3"
            )}
          >
            <CardHeader>
              {plan.highlighted && (
                <span className="inline-flex w-fit rounded-full bg-gold-100 text-gold-700 text-xs font-medium px-3 py-1 mb-2">
                  Most Popular
                </span>
              )}
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="mb-6">
                <span className="font-display text-4xl text-navy-950">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 0 }).format(
                    plan.priceMonthlyCents[currency] / 100
                  )}
                </span>
                <span className="text-ink-500 text-sm"> / month</span>
              </p>
              <ul className="flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-700">
                    <Check className="h-4 w-4 text-gold-600 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <CheckoutButton planId={plan.id} currency={currency} highlighted={plan.highlighted} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
