import { Skeleton } from "antd";
import React from "react";

const CardSkeleton = ({ w = 176, h = 90, vertical = false }) => {
  return (
    <div className={`overflow-hidden flex gap-4 ${vertical && "flex-col"}`}>
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
