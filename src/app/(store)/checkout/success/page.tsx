import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function SuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Suspense fallback={<SuccessSkeleton />}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}

function SuccessSkeleton() {
  return (
    <div className="text-center animate-pulse">
      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6" />
      <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-3" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
    </div>
  );
}
