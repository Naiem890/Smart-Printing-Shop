import React from "react";
import { Link } from "react-router-dom";
import { Buffer } from "buffer";
import {
  Cog6ToothIcon,
  EyeIcon,
  PencilIcon,
  QueueListIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

export default function ShopCardWithEditAndDelete({ shop, handleDelete }) {
  const base64Image = Buffer.from(shop.SHOP_IMAGE.data).toString("base64");

  // Create the image source with the Base64-encoded image data
  const shopImage = `data:image/jpeg;base64,${base64Image}`;
  return (
    <div className="shadow border rounded-lg hover:shadow-xl transition-all cursor-pointer">
      <div className="flex px-5 py-4 gap-5 items-center">
        <div className="w-44">
          <img src={shopImage} alt="" />
        </div>
        <div>
          <h3 className="text-2xl tracking-tight font-bold">
            {shop.SHOP_NAME}
          </h3>
          <p>{`${shop.SHOP_LOCATION_AREA}, ${shop.SHOP_LOCATION_CITY}, ${shop.SHOP_LOCATION_DISTRICT}`}</p>
        </div>
        <div className="ml-auto">
          <div className="flex flex-col">
            <div className="flex gap-5">
              <Link
                title="View Shop"
                to={`/shop/${shop.SHOP_ID}`}
                className="border-2 rounded-full border-green-200 w-10 h-10 flex justify-center items-center"
              >
                <EyeIcon className="h-6 w-6 text-green-600" />
              </Link>
              <Link
                title="Manage Services"
                to={`/shop-owner/service/edit/${shop.SHOP_ID}`}
                className="border-2 rounded-full border-purple-200 w-10 h-10 flex justify-center items-center"
              >
                <Cog6ToothIcon className="h-6 w-6 text-purple-600" />
              </Link>
              <Link
                title="Order List"
                to={`/shop-owner/orders/${shop.SHOP_ID}`}
                className="border-2 rounded-full border-cyan-200 w-10 h-10 flex justify-center items-center"
              >
                <QueueListIcon className="h-6 w-6 text-cyan-600" />
              </Link>
              <Link
                title="Edit Shop"
                to={`/shop-owner/shop/edit/${shop.SHOP_ID}`}
                className="border-2 rounded-full border-blue-200 w-10 h-10 flex justify-center items-center"
              >
                <PencilIcon className="h-6 w-6 text-blue-600" />
              </Link>
              <button
                title="Delete Shop"
                onClick={() => handleDelete(shop.SHOP_ID)}
                className="border-2 rounded-full border-red-200 w-10 h-10 flex justify-center items-center"
              >
                <TrashIcon className="h-6 w-6 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
