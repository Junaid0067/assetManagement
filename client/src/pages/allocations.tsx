
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

export default function Allocations() {
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [quantity, setQuantity] = useState(1);
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
      if (!response.ok) throw new Error("Failed to allocate item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/allocations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      toast({ title: "Item allocated successfully" });
      setSelectedItem("");
      setSelectedEmployee("");
      setQuantity(1);
    },
    onError: () => {
      toast({ title: "Failed to allocate item", variant: "destructive" });
    },
  });

  const handleAllocate = () => {
    if (!selectedItem || !selectedEmployee) {
      toast({ title: "Please select item and employee", variant: "destructive" });
      return;
    }

    const allocation = {
      itemId: Number(selectedItem),
      employeeId: Number(selectedEmployee),
      quantity: Number(quantity),
      issueDate: new Date().toISOString(),
      returnDate: null,
      status: "ALLOCATED"
    };

    try {
      await createAllocation.mutateAsync(allocation);
      toast({ title: "Item allocated successfully" });
      setSelectedItem("");
      setSelectedEmployee("");
      setQuantity(1);
    } catch (error) {
      console.error('Allocation error:', error);
      toast({ 
        title: "Failed to allocate item",
        description: "Please check item availability and try again",
        variant: "destructive" 
      });
    }
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

          <Button onClick={handleAllocate}>
            Allocate Item
          </Button>
        </div>
      </div>
    </Layout>
  );
}
