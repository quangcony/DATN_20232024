import React from "react";
import { useStateContext } from "../context";

const NoConnectWallet = () => {
  const { connect } = useStateContext();

  return (
    <div className="flex flex-col justify-center items-center p-20 gap-2">
      <h3 className="font-epilogue font-semibold text-[14px] text-white mt-2 max-w-sm text-center leading-6">
        Bạn chưa kết nối đến ví.
      </h3>
      <button
        type="button"
        onClick={connect}
        className="text-white text-[16px] border border-white px-8 py-3 rounded-lg leading-none"
      >
        Kết nối ví
      </button>
    </div>
  );
};

export default NoConnectWallet;
