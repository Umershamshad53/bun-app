import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus, Edit, Trash2, Loader2, CreditCard, MoreHorizontal } from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  Input, Label, Switch, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Textarea, Button
} from "@/features/common/components/ui";
import { feeSchema, FeeFormValues } from "@/features/dashboard/validation";
import { createFee,  updateFee, deleteFee } from "@/features/dashboard/actions/feeAction";
type PaymentType = "" | "Monthly" | "Annually";
type Fee = {
  id: number;
  name: string;
  amount: number;
  required: boolean;
  status: string;
  paymentType: PaymentType;
  feeDescription?: string;
};

type FeeManagementProps = {
  fees: Fee[];
  fetchFees: () => void;
};

export default function FeeManagement({ fees, fetchFees }: FeeManagementProps) {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFeeId, setCurrentFeeId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FeeFormValues>({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      feeName: "",
      feeDescription: "",
      feeAmount: 0,
      feeRequired: false,
    },
  });

  const handleFeeSubmitForm = async (data: FeeFormValues) => {
    setLoading(true);
    try {
      const res =
        editMode && currentFeeId
          ? await updateFee(currentFeeId, data)
          : await createFee(data);

      if (res.success) {
        fetchFees();
        handleCloseModal();
      } else {
        alert(res.message);
      }
    } catch {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (fee: FeeFormValues & { id: number; status?: string }) => {
    setEditMode(true);
    setCurrentFeeId(fee.id);
    setValue("feeName", fee.feeName);
    setValue("feeAmount", fee.feeAmount);
    setValue("feeDescription", fee.feeDescription || "");
    setValue("feeRequired", fee.feeRequired);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this fee?")) {
      const res = await deleteFee(id);
      if (res.success) fetchFees();
      else alert(res.message);
    }
  };

  const handleCloseModal = () => {
    reset();
    setEditMode(false);
    setCurrentFeeId(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Fee Configuration
              </CardTitle>
              <CardDescription>Manage fee types and amounts</CardDescription>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    setEditMode(false);
                    reset();
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Fee Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editMode ? "Edit Fee " : "Add New Fee Type"}
                  </DialogTitle>
                  <DialogDescription>
                    {editMode
                      ? "Update the fee details below"
                      : "Create a new fee category"}
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handleSubmit(handleFeeSubmitForm)}
                  className="space-y-4 pt-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="feeName">Fee Name *</Label>
                    <Input
                      id="feeName"
                      placeholder="Enter fee name"
                      {...register("feeName")}
                    />
                    {errors.feeName && (
                      <p className="text-red-600 text-sm">
                        {errors.feeName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feeAmount">Amount *</Label>
                    <Input
                      id="feeAmount"
                      type="number"
                      placeholder="0.00"
                      {...register("feeAmount", { valueAsNumber: true })}
                    />
                    {errors.feeAmount && (
                      <p className="text-red-600 text-sm">
                        {errors.feeAmount.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feeDescription">Description</Label>
                    <Textarea
                      id="feeDescription"
                      placeholder="Enter fee description"
                      rows={3}
                      {...register("feeDescription")}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="required"
                      checked={watch("feeRequired")}
                      onCheckedChange={(val) => setValue("feeRequired", val)}
                    />
                    <Label htmlFor="required">Required Fee</Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : editMode ? (
                        "Update Fee"
                      ) : (
                        "Create Fee"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee Name</TableHead>
                <TableHead>Fee Description</TableHead>
                <TableHead>Fee Amount</TableHead>
                <TableHead>Required</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.name}</TableCell>
                  <TableCell className="font-medium">
                    {fee.feeDescription}
                  </TableCell>
                  <TableCell>${fee.amount}</TableCell>
                  <TableCell>
                    {fee.required ? "Required" : "Optional"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleEdit({
                              id: fee.id,
                              feeName: fee.name,
                              feeAmount: fee.amount,
                              paymentType: fee.paymentType,
                              feeDescription: fee.feeDescription || "",
                              feeRequired: fee.required,
                              status: fee.status || "Active",
                            })
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Fee
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(fee.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Fee
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}