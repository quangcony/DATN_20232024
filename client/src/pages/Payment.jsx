import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import { contract, loader } from "../assets";
import NoConnectWallet from "../components/NoConnectWallet";

const Payment = () => {
  const { address, connect, getHistoryList } = useStateContext();
  const [history, setHistory] = useState();
  const [isLoading, setIsLoading] = useState(false);

  //Listing all transactions of a wallet
  useEffect(() => {
    const fetchHistory = async () => {
      if (address) {
        setIsLoading(true);
        try {
          const history = await getHistoryList(address);
          if (history) {
            setHistory(history);
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
      {history?.map((h) => (
        <div key={h.blockHash} className="p-4">
          <div className="text-white text-[16px] flex gap-2">
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
          <div className="max-w-[350px]">
            <h3 className="text-white font-bold text-[16px]">Giao dịch</h3>
            <ul className="list-none text-white text-[12px]">
              <li className="flex justify-between">
                <span>Ngày thực hiện</span>
                <span>{new Date(+h.timestamp * 1000).toLocaleString()}</span>
              </li>

              <li className="flex justify-between">
                <span>Amount</span>
                <span>{""}</span>
              </li>
              <li className="flex justify-between">
                <span>Gas limit (Units)</span>
                <span>{""}</span>
              </li>
              <li className="flex justify-between">
                <span>Gas price</span>
                <span>{""}</span>
              </li>
              <li className="flex justify-between">
                <span>Total</span>
                <span>{""}</span>
              </li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Payment;
