import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { suggestions } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function Suggestions() {
  const queryClient = useQueryClient();

  const { data: suggestionsData, isLoading } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () => suggestions.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => suggestions.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["suggestions"]);
      toast.success("Suggestion deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete suggestion");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this suggestion?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Book Suggestions</h2>
        <p className="text-muted-foreground">
          Review and manage book suggestions from users
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Suggested By</TableHead>
              <TableHead>Suggestion Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              suggestionsData?.data?.map((suggestion) => (
                <TableRow key={suggestion._id}>
                  <TableCell className="font-medium">
                    {suggestion.title}
                  </TableCell>
                  <TableCell>{suggestion.author}</TableCell>
                  <TableCell>{suggestion.category}</TableCell>
                  <TableCell>{suggestion?.userId?.name}</TableCell>
                  <TableCell>
                    {new Date(suggestion.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(suggestion._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
            {!isLoading && suggestionsData?.data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No suggestions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
