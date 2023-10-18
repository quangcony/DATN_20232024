import { Skeleton } from "antd";
import React from "react";

const CardSkeleton = ({ w = 176, h = 90 }) => {
  return (
    <div className="overflow-hidden flex gap-4">
      <Skeleton.Image style={{ width: w, height: h }} active />
      <Skeleton
        active
        title={false}
        paragraph={{
          rows: 2,
        }}
      />
      {/* <Skeleton
        active
        avatar
        paragraph={{
          rows: 0,
        }}
      /> */}
    </div>
  );
};

export default CardSkeleton;
