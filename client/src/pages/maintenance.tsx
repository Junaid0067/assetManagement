
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Maintenance() {
  const [selectedItem, setSelectedItem] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [performedBy, setPerformedBy] = useState("");
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery({ queryKey: ["/api/items"] });
  const { data: maintenanceRecords = [] } = useQuery({ queryKey: ["/api/maintenance"] });

  const createMaintenance = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create maintenance record");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance"] });
      toast({ title: "Maintenance record created successfully" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create maintenance record", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setSelectedItem("");
    setMaintenanceType("");
    setCost("");
    setDescription("");
    setPerformedBy("");
    setNextMaintenanceDate("");
  };

  const handleSubmit = () => {
    if (!selectedItem || !maintenanceType) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    const maintenance = {
      itemId: Number(selectedItem),
      type: maintenanceType,
      cost: Number(cost) || 0,
      description,
      performedBy,
      maintenanceDate: new Date().toISOString(),
      nextMaintenanceDate: nextMaintenanceDate ? new Date(nextMaintenanceDate).toISOString() : null,
      status: "COMPLETED"
    };

    createMaintenance.mutate(maintenance);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Maintenance Records</h1>

        <div className="grid gap-4">
          <Select value={selectedItem} onValueChange={setSelectedItem}>
            <SelectTrigger>
              <SelectValue placeholder="Select item" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item: any) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={maintenanceType} onValueChange={setMaintenanceType}>
            <SelectTrigger>
              <SelectValue placeholder="Maintenance type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="REPAIR">Repair</SelectItem>
              <SelectItem value="INSPECTION">Inspection</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="Cost"
          />

          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />

          <Input
            value={performedBy}
            onChange={(e) => setPerformedBy(e.target.value)}
            placeholder="Performed by"
          />

          <Input
            type="date"
            value={nextMaintenanceDate}
            onChange={(e) => setNextMaintenanceDate(e.target.value)}
            placeholder="Next maintenance date"
          />

          <Button onClick={handleSubmit}>
            Create Maintenance Record
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Maintenance History</h2>
          <div className="border rounded-lg divide-y">
            {maintenanceRecords.map((record: any) => {
              const item = items.find((i: any) => i.id === record.itemId);
              return (
                <div key={record.id} className="p-4">
                  <div className="font-semibold">{item?.name}</div>
                  <div>Type: {record.type}</div>
                  <div>Cost: ${record.cost}</div>
                  <div>Description: {record.description}</div>
                  <div>Performed by: {record.performedBy}</div>
                  <div>Date: {new Date(record.maintenanceDate).toLocaleDateString()}</div>
                  {record.nextMaintenanceDate && (
                    <div>Next maintenance: {new Date(record.nextMaintenanceDate).toLocaleDateString()}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
