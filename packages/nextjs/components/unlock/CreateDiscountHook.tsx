import { useState } from "react";
import { Spinner } from "../Spinner";
import { Address } from "../scaffold-eth";
import { CopyIcon } from "./assets/CopyIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { HareIcon } from "./assets/HareIcon";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { useDeployedContractInfo, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

interface Props {
  contractName: "DiscountHook" | "FixedAmountDiscountHook" | "NFTEnabledDiscountHook";
}

export const CreateDiscountHook: React.FC<Props> = ({ contractName }) => {
  const [lock, setLock] = useState("");
  const [signer, setSigner] = useState("");
  const [discount, setDiscount] = useState<bigint>(BigInt(0));

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName,
    functionName: "setDiscountForLock",
    args: [lock, signer, discount],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(contractName);
  if (deployedContractLoading) {
    return (
      <div className="mt-14">
        <Spinner width="50px" height="50px" />
      </div>
    );
  }

  return (
    <div className="flex bg-base-300 relative pb-10">
      <DiamondIcon className="absolute top-24" />
      <CopyIcon className="absolute bottom-0 left-36" />
      <HareIcon className="absolute right-0 bottom-24" />
      <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20">
        <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
          <h1 className="flex items-center justify-center">
            <strong className="mr-4">Hook Address:</strong> <Address address={deployedContractData?.address} />
          </h1>
          <div className="text-center">
            <span className="text-4xl sm:text-5xl text-black">Set Discount For Lock</span>
            {contractName !== "FixedAmountDiscountHook" && (
              <div className="badge badge-warning mt-3 justify-center">
                <strong>Enter discount amount as basis points i.e %100 = 10000 </strong>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col items-start gap-2 sm:gap-5">
            <div className="w-full">
              <input
                type="text"
                placeholder="Enter lock address"
                className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-black"
                onChange={e => setLock(e.target.value)}
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Enter signer address"
                className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-black"
                onChange={e => setSigner(e.target.value)}
              />
            </div>
            <div className="w-full">
              <input
                type="number"
                placeholder="Enter discount"
                className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-black"
                onChange={e => {
                  const val = BigInt(e.target.value);
                  setDiscount(val);
                }}
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
