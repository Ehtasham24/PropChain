'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
const chartData = [
  { month: 'January', sold: 186, purchased: 80 },
  { month: 'February', sold: 305, purchased: 200 },
  { month: 'March', sold: 237, purchased: 120 },
  { month: 'April', sold: 73, purchased: 190 },
  { month: 'May', sold: 209, purchased: 130 },
  { month: 'June', sold: 214, purchased: 140 },
];

const chartConfig = {
  purchased: {
    label: 'purchased',
    color: 'hsl(var(--chart-1))',
  },
  sold: {
    label: 'sold',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function ChartDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Properties Chart</CardTitle>
        <CardDescription>Showing total properties sold</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            width={100}
            height={50}
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='sold'
              type='natural'
              fill='var(--color-sold)'
              fillOpacity={0.4}
              stroke='var(--color-sold)'
              stackId='a'
            />
            <Area
              dataKey='purchased'
              type='natural'
              fill='var(--color-purchased)'
              fillOpacity={0.4}
              stroke='var(--color-purchased)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 font-medium leading-none'>
              Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
            </div>
            <div className='flex items-center gap-2 leading-none text-muted-foreground'>
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
