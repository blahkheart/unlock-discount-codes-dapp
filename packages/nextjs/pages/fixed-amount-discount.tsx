import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { AddStableCoin } from "~~/components/unlock/AddStableCoin";
import { CreateDiscountHook } from "~~/components/unlock/CreateDiscountHook";
import { DeleteDiscount } from "~~/components/unlock/DeleteDiscount";
import { GenerateDiscountSigner } from "~~/components/unlock/GenerateDiscountSigner";
import { RemoveStableCoin } from "~~/components/unlock/RemoveStableCoin";
import { TokenGateDiscount } from "~~/components/unlock/TokenGateDiscount";

const FixedAmountDiscount: NextPage = () => {
  return (
    <>
      <MetaHeader title="Fixed Amount Discount Hook" description="Create fixed amount discounts for your locks">
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="grid lg:grid-cols-2 flex-grow" data-theme="exampleUi">
        <AddStableCoin />
        <RemoveStableCoin />
        <CreateDiscountHook contractName="FixedAmountDiscountHook" />
        <GenerateDiscountSigner />
        <TokenGateDiscount contractName="FixedAmountDiscountHook" />
        <DeleteDiscount contractName="FixedAmountDiscountHook" />
      </div>
    </>
  );
};

export default FixedAmountDiscount;
