import React, { useEffect, useState } from "react";
import InstructionCardShopOwner from "./InstructionCardShopOwner";
import { toast } from "react-toastify";
import ShopCardWithEditAndDelete from "./ShopCardWithEditAndDelete";
import Swal from "sweetalert2";
import Loader from "../../UI-elements/Loader";

export default function ShopList() {
  const [shops, setShops] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/shops`)
      .then((res) => res.json())
      .then((data) => setShops(data.data));
  }, []);

  const handleDelete = (shopId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(
          `http://localhost:3000/api/shops/${shopId}`,
          {
            method: "DELETE",
          }
        );

        const result = await response.json();
        console.log("Success:", result);
        if (result.shopDeleted) {
          toast("Shop Deleted Successfully!!", {
            autoClose: 3000,
            type: "success",
            theme: "colored",
          });

          // setTimeout(() => {
          //   window.location.reload(false);
          // }, 3000); // Delay the reload by 3000 milliseconds (3 seconds)
        }
      }
    });
  };

  if (!shops) {
    return <Loader />;
  }

  return (
    <div className="max-w-[85%] mx-auto mt-10">
      <div>
        <div className="grid grid-cols-3 space-x-16">
          <div className="col-span-2">
            <div className="flex col-span-full justify-between">
              <h1 className="text-3xl font-bold">Shop List</h1>
            </div>
            <div className="mt-10">
              <ul className="flex flex-col gap-5">
                {shops.map((shop) => (
                  <ShopCardWithEditAndDelete
                    handleDelete={handleDelete}
                    key={shop.SHOP_ID}
                    shop={shop}
                  />
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
