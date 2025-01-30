import { Skeleton } from "../ui/skeleton";
import { TableRow, TableCell } from "../ui/table";
import { Button } from "../ui/button";
const OrderRowSkeleton = () => {
  return (
    <TableRow>
      <TableCell>
        <Button variant="ghost" size="sm" disabled>
          <Skeleton className="bg-gray-300 h-4 w-4" />
        </Button>
      </TableCell>
      <TableCell>
        <Skeleton className="bg-gray-300 h-4 w-16 rounded-md" />
      </TableCell>
      <TableCell>
        <Skeleton className="bg-gray-300 h-5 w-20 rounded-md" />
      </TableCell>
      <TableCell>
        <Skeleton className="bg-gray-300 h-4 w-24 rounded-md" />
      </TableCell>
      <TableCell>
        <Skeleton className="bg-gray-300 h-4 w-28 rounded-md" />
      </TableCell>
      <TableCell>
        <Skeleton className="bg-gray-300 h-4 w-32 rounded-md" />
      </TableCell>
      <TableCell>
        <Skeleton className="bg-gray-300 h-4 w-20 rounded-md" />
      </TableCell>
      <TableCell>
        <Skeleton className="bg-gray-300 h-4 w-16 rounded-md" />
      </TableCell>
      <TableCell>
        <Skeleton className="bg-gray-300 h-8 w-16 rounded-md" />
      </TableCell>
    </TableRow>
  );
};

export default OrderRowSkeleton;
