import { useEffect, useState } from "react";
import { CopyIcon } from "./assets/CopyIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { HareIcon } from "./assets/HareIcon";
import { ethers } from "ethers";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

const erc20ABI = ["function symbol() view returns (string)"];

interface TokenInfo {
  tokenAddress: string;
  symbol: string;
}

export const AddStableCoin = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokensInfo, setTokensInfo] = useState<TokenInfo[]>([]);
  const configuredNetwork = getTargetNetwork();
  const chainId = configuredNetwork.id;
  console.log("CHAINID", chainId);
  console.log("TOKENS INFO", tokensInfo);
  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "FixedAmountDiscountHook",
    functionName: "addStableCoin",
    args: [tokenAddress],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  async function getTokenSymbols(tokenAddresses: string[]): Promise<TokenInfo[]> {
    const tokenInfos: TokenInfo[] = [];
    if (chainId !== 31337) {
      const unlockProvider = `https://rpc.unlock-protocol.com/${chainId}`;
      const provider = new ethers.providers.JsonRpcProvider(unlockProvider);

      for (const address of tokenAddresses) {
        const contract = new ethers.Contract(address, erc20ABI, provider);
        const symbol = await contract.symbol();
        const tokenInfo: TokenInfo = {
          tokenAddress: address,
          symbol: symbol,
        };
        tokenInfos.push(tokenInfo);
      }
    }

    return tokenInfos;
  }
  const { data: currentStableCoins, isLoading: isStableCoinsLoading } = useScaffoldContractRead({
    contractName: "FixedAmountDiscountHook",
    functionName: "getStableCoins",
  });
  useEffect(() => {
    if (currentStableCoins && !isStableCoinsLoading) {
      const tokenAddresses = [...currentStableCoins];

      getTokenSymbols(tokenAddresses)
        .then(tokenData => setTokensInfo(tokenData))
        .catch(error => console.error("Error fetching token symbols:", error));
    }
  }, [currentStableCoins, isStableCoinsLoading]);

  return (
    <div className="flex bg-base-300 relative pb-10">
      <DiamondIcon className="absolute top-24" />
      <CopyIcon className="absolute bottom-0 left-36" />
      <HareIcon className="absolute right-0 bottom-24" />
      <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20">
        <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
           <div className="text-center">
            <span className="text-2xl sm:text-2xl text-black">Stablecoins added</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 mt-2">
            {tokensInfo.length
              ? tokensInfo.map(info => (
                  <div key={info.tokenAddress} className="bg-blue-500 text-white py-2 px-4 rounded text-center">
                    {info.symbol}
                  </div>
                ))
              : "No tokens found!"}
          </div>
          <div className="text-center">
            <span className="text-3xl sm:text-3xl text-black">Add stablecoin</span>
          </div>

          <div className="mt-8 flex flex-col items-start gap-2 sm:gap-5">
            <div className="w-full">
              <input
                type="text"
                placeholder="Enter stablecoin address"
                className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl placeholder-black"
                onChange={e => setTokenAddress(e.target.value)}
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
                  Add <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};