import { Skeleton } from "antd";
import React from "react";

const CardSkeleton = () => {
  return (
    <div className="overflow-hidden flex flex-col gap-4">
      <Skeleton.Image style={{ width: "100%", height: 158 }} active />
      <Skeleton
        active
        title={false}
        paragraph={{
          rows: 2,
        }}
      />
      <Skeleton
        active
        avatar
        paragraph={{
          rows: 0,
        }}
      />
    </div>
  );
};

export default CardSkeleton;
