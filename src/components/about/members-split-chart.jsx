"use client";

// React's Imports
// React's Imports
import { useMemo, useState } from "react";

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

// App's External Imports
import { Pie, Label, PieChart } from "recharts";

const chartData = {
  "2024-25": [
    { category: "TE", members: 10, fill: "hsl(var(--chart-2))" },
    { category: "SE", members: 15, fill: "hsl(var(--chart-3))" },
    { category: "BE", members: 10, fill: "hsl(var(--chart-1))" },
  ],
  "2025-26": [
    { category: "TE", members: 16, fill: "hsl(var(--chart-2))" },
    { category: "SE", members: 17, fill: "hsl(var(--chart-3))" },
    { category: "BE", members: 7, fill: "hsl(var(--chart-1))" },
  ],
};

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
  const [activeYear, setActiveYear] = useState("2025-26");

  const currentData = useMemo(() => chartData[activeYear], [activeYear]);

  const total_members = useMemo(() => {
    return currentData.reduce((acc, { members }) => acc + members, 0);
  }, [currentData]);

  return (
    <Card className="flex flex-col bg-neutral-900 border-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2 chart-header-mobile">
        <div className="space-y-1">
          <CardTitle className="chart-title-mobile">Members Split</CardTitle>
          <CardDescription className="chart-description-mobile">
            {activeYear === "2024-25"
              ? "August 2024 - 2025"
              : "August 2025 - 2026"}
          </CardDescription>
        </div>
        <div className="flex gap-1 bg-neutral-800 p-1 rounded-lg chart-buttons-mobile">
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
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={currentData}
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
