
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Allocations() {
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [returnDate, setReturnDate] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery({ queryKey: ["/api/items"] });
  const { data: employees = [] } = useQuery({ queryKey: ["/api/employees"] });
  const { data: allocations = [] } = useQuery({ queryKey: ["/api/allocations"] });

  const createAllocation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/allocations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to allocate item");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/allocations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      toast({ title: "Item allocated successfully" });
      setSelectedItem("");
      setSelectedEmployee("");
      setQuantity(1);
      setReturnDate("");
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });

  const handleAllocate = async () => {
    if (!selectedItem || !selectedEmployee) {
      toast({ title: "Please select item and employee", variant: "destructive" });
      return;
    }

    const allocation = {
      itemId: Number(selectedItem),
      employeeId: Number(selectedEmployee),
      quantity: Number(quantity),
      issueDate: new Date().toISOString(),
      returnDate: returnDate ? new Date(returnDate).toISOString() : null,
      status: "ALLOCATED"
    };

    try {
      await createAllocation.mutateAsync(allocation);
    } catch (error) {
      console.error('Allocation error:', error);
    }
  };

  const getAllocationDetails = () => {
    return allocations.map((allocation: any) => {
      const item = items.find((i: any) => i.id === allocation.itemId);
      const employee = employees.find((e: any) => e.id === allocation.employeeId);
      return {
        ...allocation,
        itemName: item?.name,
        employeeName: employee?.name,
        department: employee?.department
      };
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Allocate Items</h1>

        <div className="grid gap-4">
          <Select value={selectedItem} onValueChange={setSelectedItem}>
            <SelectTrigger>
              <SelectValue placeholder="Select item" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item: any) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.name} (Available: {item.quantity})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee: any) => (
                <SelectItem key={employee.id} value={employee.id.toString()}>
                  {employee.name} ({employee.department})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            placeholder="Quantity"
          />

          <Input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            placeholder="Return Date"
          />

          <Button onClick={handleAllocate}>
            Allocate Item
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Current Allocations</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getAllocationDetails().map((allocation: any) => (
                <TableRow key={allocation.id}>
                  <TableCell>{allocation.itemName}</TableCell>
                  <TableCell>{allocation.employeeName}</TableCell>
                  <TableCell>{allocation.department}</TableCell>
                  <TableCell>{allocation.quantity}</TableCell>
                  <TableCell>{new Date(allocation.issueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {allocation.returnDate 
                      ? new Date(allocation.returnDate).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell>{allocation.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
