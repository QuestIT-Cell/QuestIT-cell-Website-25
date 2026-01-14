"use client";

// App's Internal Imports
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartTooltip,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

// React's Imports
import { useMemo, useState } from "react";

// App's External Imports
import { Bar, XAxis, BarChart, CartesianGrid } from "recharts";

const chartData = {
  "2024-25": [
    { category: "Tech", events: 5, fill: "hsl(var(--chart-2))" },
    { category: "Non-Tech", events: 2, fill: "hsl(var(--chart-3))" },
    { category: "Hackathon", events: 2, fill: "hsl(var(--chart-1))" },
  ],
  "2025-26": [
    { category: "Tech", events: 5, fill: "hsl(var(--chart-2))" },
    { category: "Non-Tech", events: 2, fill: "hsl(var(--chart-3))" },
    { category: "Hackathon", events: 2, fill: "hsl(var(--chart-1))" },
  ],
};

const config = {
  events: {
    label: "Events",
  },
  Tech: {
    label: "Tech",
    color: "hsl(var(--chart-2))",
  },
  "Non-Tech": {
    label: "Non-Tech",
    color: "hsl(var(--chart-3))",
  },
  Hackathon: {
    label: "Hackathon",
    color: "hsl(var(--chart-1))",
  },
};

const EventsSplitChart = () => {
  const [activeYear, setActiveYear] = useState("2025-26");
  const currentData = useMemo(() => chartData[activeYear], [activeYear]);

  return (
    <Card className="flex flex-col bg-neutral-900 border-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Events Split</CardTitle>
          <CardDescription>
            {activeYear === "2024-25" ? "AY 2024 - 2025" : "AY 2025 - 2026"}
          </CardDescription>
        </div>
        <div className="flex gap-1 bg-neutral-800 p-1 rounded-lg">
          {Object.keys(chartData).map((year) => (
            <Button
              key={year}
              variant={activeYear === year ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => setActiveYear(year)}
            >
              {year}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <BarChart data={currentData} accessibilityLayer>
            <CartesianGrid vertical={false} />

            <XAxis
              tickMargin={10}
              tickLine={false}
              axisLine={false}
              dataKey="category"
              tickFormatter={(value) => config[value]?.label}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Bar radius={8} activeIndex={2} strokeWidth={2} dataKey="events" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default EventsSplitChart;
