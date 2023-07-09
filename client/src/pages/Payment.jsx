import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import { contract, copy, eth, loader } from "../assets";
import NoConnectWallet from "../components/NoConnectWallet";
import { ethers } from "ethers";
import { copyToClipboard, truncateMiddleText } from "../common";
import { Tooltip } from "antd";
import { message } from "antd";

const Payment = () => {
  const { address, connect, getHistoryList } = useStateContext();
  const [history, setHistory] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  //Listing all transactions of a wallet
  useEffect(() => {
    const fetchHistory = async () => {
      if (address) {
        setIsLoading(true);
        try {
          const history = await getHistoryList(address);
          if (history) {
            const sortData = history.sort((a, b) => b.timestamp - a.timestamp);
            setHistory(sortData);
          }
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      }
    };
    fetchHistory();
  }, [address]);

  if (isLoading)
    return (
      <div className="flex justify-center">
        <img
          src={loader}
          width={100}
          height={100}
          className="object-contain"
          alt=""
        />
      </div>
    );

  if (!address) {
    return <NoConnectWallet />;
  }

  return (
    <div>
      {contextHolder}
      {history?.map((h) => (
        <div key={h.hash} className="p-4">
          <div className="text-[#111111] dark:text-white text-[16px] flex gap-2">
            <strong>Từ</strong> <span className="text-gray-500">{h.from}</span>
            <strong>đến</strong>
            <div className="text-gray-500">
              {h.creates ? (
                <div className="flex">
                  <img
                    src={contract}
                    width={24}
                    height={24}
                    className="object-contain"
                    alt=""
                  />
                  <span>{h.creates}</span>
                </div>
              ) : (
                h.to
              )}
            </div>
          </div>
          <div className="max-w-[450px]">
            <h3 className="text-[#111111] dark:text-white font-bold text-[16px]">
              Giao dịch
            </h3>
            <ul className="list-none text-[#111111] dark:text-white text-[12px]">
              <li className="flex justify-between">
                <span>Hash</span>
                <div className="inline-flex">
                  {truncateMiddleText(h.hash)}
                  <span
                    className="opacity-75 cursor-pointer ml-1"
                    onClick={() => {
                      copyToClipboard(h.hash);
                      messageApi.open({
                        type: "success",
                        content: "Đã sao chép đến clipboard!",
                      });
                    }}
                  >
                    <Tooltip title="Sao chép Hash" color="#EA2027">
                      <img
                        src={copy}
                        width={16}
                        alt="hash"
                        className="invert dark:invert-0"
                      />
                    </Tooltip>
                  </span>
                </div>
              </li>
              <li className="flex justify-between">
                <span>Ngày thực hiện</span>
                <span>{new Date(+h.timestamp * 1000).toLocaleString()}</span>
              </li>

              <li className="flex justify-between">
                <span>Amount</span>
                <div className="inline-flex">
                  <img src={eth} width={10} alt="" className="mr-2" />
                  <span>
                    {ethers.utils.formatEther(h.value.toString())} ETH
                  </span>
                </div>
              </li>
              <li className="flex justify-between">
                <span>Gas limit (Units)</span>
                <span>{ethers.utils.formatUnits(h.gasLimit, "wei")}</span>
              </li>
              <li className="flex justify-between">
                <span>Gas price</span>
                <span>
                  {ethers.utils.formatUnits(h.gasPrice, "gwei")} Gwei
                  <span className="text-gray-500">
                    &nbsp;({ethers.utils.formatEther(h.gasPrice.toString())}{" "}
                    ETH)
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Payment;
