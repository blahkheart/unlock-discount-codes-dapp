import { useState } from "react";
import { CopyIcon } from "./assets/CopyIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { HareIcon } from "./assets/HareIcon";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

interface Props {
  contractName: "DiscountHook" | "FixedAmountDiscountHook" | "NFTEnabledDiscountHook";
}

export const TokenGateDiscount: React.FC<Props> = ({ contractName }) => {
  const [lock, setLock] = useState("");
  const [signer, setSigner] = useState("");
  const [requiredLock, setRequiredLock] = useState("");

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName,
    functionName: "setLockEnabledDiscount",
    args: [lock, signer, requiredLock],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <div className="flex bg-base-300 relative pb-10">
      <DiamondIcon className="absolute top-24" />
      <CopyIcon className="absolute bottom-0 left-36" />
      <HareIcon className="absolute right-0 bottom-24" />
      <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20">
        <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
          <div className="text-center">
            <span className="text-4xl sm:text-5xl text-black">Token gate discount</span>
          </div>

          <div className="mt-8 flex flex-col items-start gap-2 sm:gap-5">
            <div className="w-full">
              <input
                type="text"
                placeholder="Lock address"
                className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-black"
                onChange={e => setLock(e.target.value)}
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Signer address"
                className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-black"
                onChange={e => setSigner(e.target.value)}
              />
            </div>
            <div className="w-full">
              <input
                type="number"
                placeholder="Required lock address"
                className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-black"
                onChange={e => setRequiredLock(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 w-full">
            <button
              className={`btn btn-primary rounded-full w-full capitalize font-normal font-white flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
                isLoading ? "loading" : ""
              }`}
              onClick={() => writeAsync()}
            >
              {!isLoading && (
                <>
                  Send <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
