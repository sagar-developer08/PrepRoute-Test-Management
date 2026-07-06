import * as React from "react";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { Skeleton } from "@/ui/skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { formatDate } from "@/shared/utils/formatDate";
import { useTestsList } from "@/features/tests/hooks/useTests";
import { TestStatusBadge } from "../components/TestStatusBadge";
import { TestRowActions } from "../components/TestRowActions";

const PAGE_SIZE = 10;

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: tests, isLoading, isError, error } = useTestsList();
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const debouncedSearch = useDebounce(search, 250);

  const filteredTests = React.useMemo(() => {
    if (!tests) return [];
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return tests;
    return tests.filter(
      (test) =>
        test.name.toLowerCase().includes(query) ||
        test.subject?.toLowerCase().includes(query) ||
        test.status?.toLowerCase().includes(query),
    );
  }, [tests, debouncedSearch]);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const pageCount = Math.max(1, Math.ceil(filteredTests.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginatedTests = React.useMemo(
    () => filteredTests.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredTests, currentPage],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Tests</h1>
          <p className="text-sm text-muted">Create, edit and publish tests for your learners.</p>
        </div>
        <Button onClick={() => navigate("/tests/new")}>
          <Plus className="size-4" />
          Create New Test
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, subject or status"
          className="pl-9"
        />
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <EmptyState title="Could not load tests" description={error instanceof Error ? error.message : undefined} />
      )}

      {!isLoading && !isError && filteredTests.length === 0 && (
        <EmptyState
          title={tests && tests.length > 0 ? "No tests match your search" : "No tests yet"}
          description={tests && tests.length > 0 ? "Try a different search term." : "Create your first test to get started."}
          action={
            !tests || tests.length === 0 ? (
              <Button onClick={() => navigate("/tests/new")}>
                <Plus className="size-4" />
                Create New Test
              </Button>
            ) : undefined
          }
        />
      )}

      {!isLoading && !isError && filteredTests.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTests.map((test) => (
                <TableRow
                  key={test.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/tests/${test.id}/publish`)}
                >
                  <TableCell className="font-medium text-foreground">{test.name}</TableCell>
                  <TableCell className="text-muted">{test.subject}</TableCell>
                  <TableCell className="text-muted">
                    {(test.questions?.length ?? 0)}/{test.total_questions}
                  </TableCell>
                  <TableCell>
                    <TestStatusBadge status={test.status} />
                  </TableCell>
                  <TableCell className="text-muted">{formatDate(test.created_at)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <TestRowActions test={test} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pageCount > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">
                Page {currentPage} of {pageCount} . {filteredTests.length} tests
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={currentPage === pageCount}
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
