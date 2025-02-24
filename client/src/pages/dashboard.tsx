import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, FileBarChart } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function Dashboard() {
  const { data: items } = useQuery({
    queryKey: ["/api/items"],
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: allocations } = useQuery({
    queryKey: ["/api/allocations"],
  });

  const chartData = {
    labels: ["Uniforms", "Consumables", "Equipment"],
    datasets: [
      {
        label: "Items by Category",
        data:
          items?.reduce((acc: any, item: any) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
          }, {}) || [],
        backgroundColor: [
          "hsl(var(--chart-1))",
          "hsl(var(--chart-2))",
          "hsl(var(--chart-3))",
        ],
      },
    ],
  };

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{items?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Employees
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {employees?.filter((e: any) => e.status === "active").length ||
                  0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Allocations
              </CardTitle>
              <FileBarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allocations?.filter((a: any) => a.status === "ALLOCATED")
                  .length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
