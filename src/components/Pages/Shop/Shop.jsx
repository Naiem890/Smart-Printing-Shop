import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import {
  ArrowLeftIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../UI-elements/Loader";

export default function Shop() {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [shopImage, setShopImage] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetch(`http://localhost:3000/api/shops/${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        setShop(data);
        const base64Image = Buffer.from(data.SHOP_IMAGE.data).toString(
          "base64"
        );

        // Create the image source with the Base64-encoded image data
        setShopImage(`data:image/jpeg;base64,${base64Image}`);
      });
  }, [shopId, shopImage]);

  if (!shop) {
    return <Loader />;
  }

  return (
    <div className="max-w-[85%] mx-auto mt-10 mb-20">
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
              <img src={shopImage} alt="" />
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
                <ul
                  onChange={(e) => {
                    console.log(e.target.value);
                    setSelectedService(e.target.value);
                  }}
                  className="mt-5 grid grid-cols-2 gap-4"
                >
                  {shop.SHOP_SERVICES?.length == 0 && (
                    <p className="text-gray-500 font-mono">
                      No Service available
                    </p>
                  )}
                  {shop.SHOP_SERVICES?.map((service) => (
                    <li key={service.SERVICE_ID}>
                      <input
                        type="radio"
                        id={service.SERVICE_NAME}
                        name="hosting"
                        value={service.SERVICE_ID}
                        class="hidden peer"
                        required
                        disabled={service.SERVICE_AVAILABILITY ? false : true}
                      />
                      <label
                        for={service.SERVICE_NAME}
                        class={`inline-flex items-center justify-between w-full p-5 text-gray-500  border border-gray-200 rounded-lg dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500  peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600  transition-all dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 ${
                          service.SERVICE_AVAILABILITY
                            ? "bg-white cursor-pointer hover:shadow-xl"
                            : "bg-slate-100 cursor-not-allowed"
                        }`}
                      >
                        <div class="block disabled:bg-slate-400">
                          <div class="w-full text-xl mb-2 font-semibold">
                            {service.SERVICE_NAME}
                          </div>
                          <div class="w-full text-gray-500 font-mono">
                            Per unit charge: {service.SERVICE_CHARGE_PER_UNIT}
                            BDT
                          </div>
                          <div class="w-full text-gray-500 font-mono">
                            ETA: {service.ESTIMATED_TIME_IN_MIN_REQUIRED}
                            Min/Unit
                          </div>
                          <div
                            className={`w-full mt-1 ${
                              service.SERVICE_AVAILABILITY
                                ? "text-green-500"
                                : "text-red-500"
                            } font-mono`}
                          >
                            Service{" "}
                            {service.SERVICE_AVAILABILITY
                              ? "Available"
                              : "Unavailable"}
                          </div>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Link
                    disabled={!selectedService}
                    to={`/order-service/${selectedService}`}
                    class={`inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg 
                    bg-blue-700 hover:bg-primary-800 focus:ring-4 disabled:bg-slate-400 disabled:cursor-not-allowed focus:ring-primary-300 dark:focus:ring-primary-900`}
                  >
                    Order Service
                    <svg
                      class="w-5 h-5 ml-2 -mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
