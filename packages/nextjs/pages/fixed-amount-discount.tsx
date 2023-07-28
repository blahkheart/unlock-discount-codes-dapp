import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { AddStableCoin } from "~~/components/unlock/AddStableCoin";
import { CreateDiscountHook } from "~~/components/unlock/CreateDiscountHook";
import { DeleteDiscount } from "~~/components/unlock/DeleteDiscount";
import { GenerateDiscountSigner } from "~~/components/unlock/GenerateDiscountSigner";
import { RemoveStableCoin } from "~~/components/unlock/RemoveStableCoin";
import { CopyIcon } from "~~/components/unlock/assets/CopyIcon";
import { DiamondIcon } from "~~/components/unlock/assets/DiamondIcon";
import { HareIcon } from "~~/components/unlock/assets/HareIcon";

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
        <GenerateDiscountSigner />
        <CreateDiscountHook contractName="FixedAmountDiscountHook" />
        <DeleteDiscount contractName="FixedAmountDiscountHook" />
        {/* component below serves as page filler for aethestics only */}
        <div className="hidden lg:flex bg-base-300 relative pb-10">
          <DiamondIcon className="absolute top-24" />
          <CopyIcon className="absolute bottom-0 left-36" />
          <HareIcon className="absolute right-0 bottom-24" />
        </div>
      </div>
    </>
  );
};

export default FixedAmountDiscount;