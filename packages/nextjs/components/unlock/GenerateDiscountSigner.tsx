import { useState } from "react";
import { CopyIcon } from "./assets/CopyIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { HareIcon } from "./assets/HareIcon";
import { ethers } from "ethers";
import { ArrowSmallRightIcon, ClipboardDocumentIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { notification } from "~~/utils/scaffold-eth";

export const GenerateDiscountSigner = () => {
  const [visible, setVisible] = useState(true);
  const [code, setCode] = useState("");
  const [signer, setSigner] = useState("");

  const handleChange = (e: any) => {
    setSigner("");
    setCode(e);
  };

  const handleSubmit = async () => {
    if (!code) return;
    const encoded = ethers.utils.defaultAbiCoder.encode(["bytes32"], [ethers.utils.id(code)]);
    const privateKey = ethers.utils.keccak256(encoded);
    const privateKeyAccount = new ethers.Wallet(privateKey);
    console.log("handleSubmit::", code);

    return setSigner(privateKeyAccount.address);
  };

  const handleCopySignerAddress = (text: string) => {
    if (signer) {
      navigator.clipboard.writeText(text);
      notification.success("Copied text");
    } else {
      notification.error("Nothing to copy");
      return;
    }
  };

  return (
    <div className="flex bg-base-300 relative pb-10">
      <DiamondIcon className="absolute top-24" />
      <CopyIcon className="absolute bottom-0 left-36" />
      <HareIcon className="absolute right-0 bottom-24" />
      <div className="flex flex-col w-full mx-5 sm:mx-8 2xl:mx-20">
        <div className={`mt-10 flex gap-2 ${visible ? "" : "hidden"} max-w-2xl`}>
          <div className="flex gap-5 bg-base-200 bg-opacity-80 z-0 p-7 rounded-2xl shadow-lg">
            <span className="text-3xl">👋🏻</span>
            <div>
              <div>
                Create signer addresses for <strong>discount codes</strong>. After deciding on the discount code of your
                choice, you can generate the corresponding signer address by using this tool. Have fun!
              </div>
              <div className="mt-2">
                📌 The lock address for which the discount code is to be used, the signer address generated, and the
                discount amount are all used as inputs when setting up discounts for your locks.
              </div>
            </div>
          </div>
          <button
            className="btn btn-circle btn-ghost h-6 w-6 bg-base-200 bg-opacity-80 z-0 min-h-0 drop-shadow-md"
            onClick={() => setVisible(false)}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
          <span className="text-4xl sm:text-4xl text-black">Enter discount code</span>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
            <input
              type="text"
              value={code}
              className="input font-bai-jamjuree w-full px-5 bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] border border-primary text-lg sm:text-2xl"
              onChange={e => {
                const val: string = e.target.value;
                handleChange(val);
              }}
            />
            <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
              <div className="flex rounded-full border-2 border-primary p-1">
                <button
                  className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest}`}
                  onClick={() => handleSubmit()}
                >
                  <>
                    Send <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                  </>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 items-start items-center">
            <span className="text-sm leading-tight">Signer:</span>
            <div className="badge badge-success">
              <strong>{signer}</strong>
            </div>
            {signer && (
              <button
                className="btn rounded-lg btn-sm mr-3"
                onClick={() => {
                  handleCopySignerAddress(signer);
                }}
              >
                <ClipboardDocumentIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
