import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LeaveCommentsSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="d-flex gap-3 mb-4 align-items-start">
          <Skeleton circle width={42} height={42} />

          <div style={{ flex: 1 }}>
            <Skeleton width={120} height={14} />

            <Skeleton width={80} height={10} className="mt-2" />

            <Skeleton height={12} count={2} className="mt-3" />
          </div>
        </div>
      ))}
    </>
  );
};

export default LeaveCommentsSkeleton;
