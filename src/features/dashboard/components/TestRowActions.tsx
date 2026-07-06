import * as React from "react";
import { Eye, ListPlus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Button } from "@/ui/button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useDeleteTest } from "@/features/tests/hooks/useTests";
import { useToast } from "@/shared/hooks/useToast";
import type { Test } from "@/features/tests/types";

export function TestRowActions({ test }: { test: Test }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const deleteTest = useDeleteTest();

  const handleDelete = () => {
    deleteTest.mutate(test.id, {
      onSuccess: () => {
        toast({ title: "Test deleted", variant: "success" });
        setConfirmOpen(false);
      },
      onError: (error: Error) => {
        toast({ title: "Could not delete test", description: error.message, variant: "destructive" });
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => navigate(`/tests/${test.id}/publish`)}>
            <Eye className="size-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate(`/tests/${test.id}/edit`)}>
            <Pencil className="size-4" />
            Edit details
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate(`/tests/${test.id}/questions`)}>
            <ListPlus className="size-4" />
            Manage questions
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive onSelect={() => setConfirmOpen(true)}>
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete "${test.name}"?`}
        description="This will permanently remove the test and cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleteTest.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
