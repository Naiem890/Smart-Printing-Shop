import React, { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { useParams } from "react-router-dom";

export default function Shop() {
  const { shopId } = useParams();
  const [shop, setShop] = useState({});

  useEffect(() => {
    fetch(`http://localhost:3000/api/shops/${shopId}`)
      .then((res) => res.json())
      .then((data) => setShop(data));
  }, [shopId]);

  return (
    <div className="max-w-[90%] mx-auto mt-10">
      <div>
        <div className="flex gap-8 items-center">
          <a href="/search" className="">
            <ArrowLeftIcon className="h-6 w-6" />
          </a>
          <h1 className="text-3xl font-bold">Shop Details</h1>
        </div>
        <div className="mt-10">
          <div className="flex gap-20">
            <div className="flex-1">
              <img
                src="https://www.ryman.co.uk/media/wysiwyg/-ryman/LandingPages/Print_Services/store_1.jpg"
                alt=""
              />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-slate-800 leading-tight">
                {shop.SHOP_NAME}
              </h1>
              <div className="flex gap-2 items-center mt-4">
                <span>
                  <MapPinIcon className="h-6 w-6 text-slate-500" />
                </span>
                <p className="text-xl">{`${shop.SHOP_LOCATION_AREA}, ${shop.SHOP_LOCATION_CITY}, ${shop.SHOP_LOCATION_DISTRICT}`}</p>
              </div>
              <div className="flex gap-2 items-center mt-4">
                <span>
                  <StarIcon className="h-6 w-6  text-orange-400" />
                </span>
                <p className="text-xl">3.6/5 (2000+)</p>
              </div>
              <div className="flex gap-2 items-center mt-4">
                <span>
                  <ClockIcon className="h-6 w-6  text-green-700" />
                </span>
                <p className="text-xl">{shop.SHOP_ACTIVE_HOURS}</p>
              </div>
              <div>
                <h3 className="text-xl mt-8 font-semibold leading-tight">
                  Services
                </h3>
                <ul className="mt-5 grid grid-cols-2 gap-10">
                  {shop.SHOP_SERVICES?.map((service) => (
                    <li className="shadow mb-6 font-mono">
                      <div className="p-6">
                        <h3 className="text-lg font-bold">
                          {service.SERVICE_NAME}
                        </h3>
                        <p className="text-gray-500">
                          Per unit charge: {service.SERVICE_CHARGE_PER_UNIT}
                        </p>
                        <p className="text-gray-500">
                          ETA: {service.ESTIMATED_TIME_IN_MIN_REQUIRED} Hours
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
