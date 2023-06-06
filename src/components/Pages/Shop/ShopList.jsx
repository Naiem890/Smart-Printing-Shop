import React, { useEffect, useState } from "react";
import InstructionCardShopOwner from "./InstructionCardShopOwner";
import { toast } from "react-toastify";
import ShopCardWithEditAndDelete from "./ShopCardWithEditAndDelete";

export default function ShopList() {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/shops`)
      .then((res) => res.json())
      .then((data) => setShops(data));
  }, []);

  return (
    <div className="max-w-[90%] mx-auto mt-10">
      <div>
        <div className="grid grid-cols-3 space-x-16">
          <div className="col-span-2">
            <div className="flex col-span-full justify-between">
              <h1 className="text-3xl font-bold">Shop List</h1>
            </div>
            <div className="mt-10">
              <ul className="flex flex-col gap-5">
                {shops.map((shop) => (
                  <ShopCardWithEditAndDelete key={shop.SHOP_ID} shop={shop} />
                ))}
              </ul>
            </div>
          </div>
          <div className="col-span-1">
            <InstructionCardShopOwner />
          </div>
        </div>
      </div>
    </div>
  );
}
