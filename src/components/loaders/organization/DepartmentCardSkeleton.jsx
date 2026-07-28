import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DepartmentCardSkeleton = () => {
  return (
    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
      <div
        className="card h-100 border-0"
        style={{
          borderRadius: "12px",
          boxShadow: "0 6px 20px rgba(31, 61, 136, 0.08)",
        }}
      >
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start">
            <div style={{ width: "70%" }}>
              <Skeleton height={17} width="75%" />
              <Skeleton height={10} width="45%" style={{ marginTop: "8px" }} />
            </div>

            <Skeleton width={32} height={32} borderRadius={8} />
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <Skeleton width={58} height={22} borderRadius={20} />
            <Skeleton width={62} height={30} borderRadius={7} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCardSkeleton;
