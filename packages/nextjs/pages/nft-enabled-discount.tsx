import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { CreateDiscountHook } from "~~/components/unlock/CreateDiscountHook";
import { DeleteDiscount } from "~~/components/unlock/DeleteDiscount";
import { GenerateDiscountSigner } from "~~/components/unlock/GenerateDiscountSigner";
import { TokenGateDiscount } from "~~/components/unlock/TokenGateDiscount";

const NFTEnabledDiscount: NextPage = () => {
  return (
    <>
      <MetaHeader
        title="Token Gated Discount Hook"
        description="Create discounts that are enabled by owning specific lock NFTs"
      >
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="grid lg:grid-cols-2 flex-grow" data-theme="exampleUi">
        <GenerateDiscountSigner />
        <CreateDiscountHook contractName="NFTEnabledDiscountHook" />
        <TokenGateDiscount />
        <DeleteDiscount contractName="NFTEnabledDiscountHook" />
      </div>
    </>
  );
};

export default NFTEnabledDiscount;
