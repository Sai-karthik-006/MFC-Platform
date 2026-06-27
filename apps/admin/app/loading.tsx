import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm space-y-4">
        <Skeleton variant="rectangular" height={40} className="rounded-lg" />
        <Skeleton variant="rectangular" height={20} />
        <Skeleton variant="rectangular" height={20} />
        <Skeleton variant="rectangular" height={20} />
      </div>
    </div>
  );
}