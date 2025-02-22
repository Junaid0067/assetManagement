import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export default function Reports() {
  const [reportType, setReportType] = useState("stock");

  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ["/api/items"],
  });

  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: allocations = [], isLoading: allocationsLoading } = useQuery({
    queryKey: ["/api/allocations"],
  });

  if (itemsLoading || employeesLoading || allocationsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  const getCurrentStockReport = () => {
    return items.map((item: any) => ({
      ...item,
      allocated: allocations.reduce(
        (sum: number, allocation: any) =>
          allocation.itemId === item.id ? sum + allocation.quantity : sum,
        0
      ),
    }));
  };

  const getEmployeeAllocationReport = () => {
    const employeeAllocations = employees.map((employee: any) => {
      const employeeItems = allocations
        .filter((allocation: any) => allocation.employeeId === employee.id)
        .map((allocation: any) => {
          const item = items.find((i: any) => i.id === allocation.itemId);
          return {
            ...allocation,
            itemName: item?.name,
          };
        });

      return {
        ...employee,
        allocations: employeeItems,
      };
    });

    return employeeAllocations;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reports</h1>

          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stock">Current Stock</SelectItem>
              <SelectItem value="employee">Employee Allocations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {reportType === "stock" ? "Current Stock Report" : "Employee Allocation Report"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reportType === "stock" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Total Quantity</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead>Available</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getCurrentStockReport().map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.allocated}</TableCell>
                      <TableCell>{item.quantity - item.allocated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Items Allocated</TableHead>
                    <TableHead>Total Items</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getEmployeeAllocationReport().map((employee: any) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        {employee.allocations.map((a: any) => (
                          <div key={a.id}>
                            {a.itemName} (Qty: {a.quantity})
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {employee.allocations.reduce(
                          (sum: number, a: any) => sum + a.quantity,
                          0
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
