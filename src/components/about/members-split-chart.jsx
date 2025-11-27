"use client";

// React's Imports
import { useMemo } from "react";

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
import { Pie, Label, PieChart } from "recharts";

const data = [
  { category: "TE", members: 10, fill: "hsl(var(--chart-2))" },
  { category: "SE", members: 15, fill: "hsl(var(--chart-3))" },
  { category: "BE", members: 10, fill: "hsl(var(--chart-1))" },
];

const config = {
  members: {
    label: "Members",
  },
  BE: {
    label: "BE Members",
    color: "hsl(var(--chart-1))",
  },
  TE: {
    label: "TE Members",
    color: "hsl(var(--chart-2))",
  },
  SE: {
    label: "SE Members",
    color: "hsl(var(--chart-3))",
  },
};

const MembersSplitChart = () => {
  const total_members = useMemo(() => {
    return data.reduce((acc, { members }) => acc + members, 0);
  }, []);

  return (
    <Card className="flex flex-col bg-neutral-900 border-none">
      <CardHeader>
        <CardTitle>Members Split</CardTitle>
        <CardDescription>August 2024 - 2025</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              strokeWidth={5}
              innerRadius={60}
              dataKey="members"
              nameKey="category"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total_members.toLocaleString()}
                        </tspan>

                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Members
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MembersSplitChart;
