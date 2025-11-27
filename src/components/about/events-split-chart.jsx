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

// App's External Imports
import { Bar, XAxis, BarChart, CartesianGrid } from "recharts";

const data = [
  { category: "Tech", events: 5, fill: "hsl(var(--chart-2))" },
  { category: "Non-Tech", events: 2, fill: "hsl(var(--chart-3))" },
  { category: "Hackathon", events: 2, fill: "hsl(var(--chart-1))" },
];

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
  return (
    <Card className="flex flex-col bg-neutral-900 border-none">
      <CardHeader>
        <CardTitle>Events Split</CardTitle>
        <CardDescription>AY 2024 - 2025</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <BarChart data={data} accessibilityLayer>
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
