import Skeleton from "react-loading-skeleton";

const HolidayTableSkeleton = ({ rows = 6 }) => {
    return (
        <>
            {Array.from({ length: rows }).map((_, index) => (
                <tr key={index}>
                    {/* Holiday Name */}
                    <td>
                        <div className="hstack gap-3">
                            <Skeleton circle width={32} height={32} />
                            <Skeleton width={140} height={14} />
                        </div>
                    </td>

                    {/* Status */}
                    <td>
                        <div className="d-flex align-items-center gap-2">
                            <Skeleton circle width={10} height={10} />
                            <Skeleton width={60} height={12} />
                        </div>
                    </td>

                    {/* Date */}
                    <td>
                        <Skeleton width={80} height={22} borderRadius={999} />
                    </td>

                    {/* Day */}
                    <td>
                        <Skeleton width={70} height={14} />
                    </td>

                    {/* Holiday Type */}
                    <td>
                        <Skeleton width={90} height={22} borderRadius={8} />
                    </td>
                </tr>
            ))}
        </>
    );
};

export default HolidayTableSkeleton;
