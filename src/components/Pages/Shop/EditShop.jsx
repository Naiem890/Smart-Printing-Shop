import React, { useEffect, useState } from "react";
import InstructionCardShopOwner from "./InstructionCardShopOwner";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function EditShop() {
  const { shopId } = useParams();
  const [shop, setShop] = useState({});
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [activeHour, setActiveHour] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/api/shops/${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        setShop(data);

        setName(data.SHOP_NAME);
        setDistrict(data.SHOP_LOCATION_DISTRICT);
        setCity(data.SHOP_LOCATION_CITY);
        setArea(data.SHOP_LOCATION_AREA);
        setActiveHour(data.SHOP_ACTIVE_HOURS);
      });
  }, [shopId]);

  const handleUpdateShop = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const district = e.target.district.value;
    const city = e.target.city.value;
    const area = e.target.area.value;
    const activeHour = e.target.activeHour.value;

    const shopData = {
      student_id: shop.SHOP_ID,
      name,
      district,
      city,
      area,
      activeHour,
    };

    console.log(shopData);

    const response = await fetch("http://localhost:3000/api/shop/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shopData),
    });

    const result = await response.json();
    console.log("Success:", result);
    if (result.shopUpdated) {
      toast("Shop Updated Successfully!!");
    }
  };

  return (
    <div className="max-w-[90%] mx-auto mt-10">
      <div>
        <div className="grid grid-cols-3 space-x-16">
          <div className="col-span-2">
            <form
              onSubmit={handleUpdateShop}
              className="grid grid-cols-2 gap-10"
            >
              <div className="flex col-span-full justify-between">
                <div className="flex gap-8 items-center">
                  <Link to="/shop-owner/shop-list" className="">
                    <ArrowLeftIcon className="h-6 w-6" />
                  </Link>
                  <h1 className="text-3xl font-bold">Edit Shop</h1>
                </div>
                <button
                  type="submit"
                  class="inline-flex justify-center h-12 w-full text-center sm:w-auto items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 sm:ml-3"
                >
                  Update Shop Details
                </button>
              </div>
              <div>
                <label
                  for="name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Shop Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  name="name"
                  id="name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="PrintPulse Studio"
                  required={true}
                />
              </div>
              <div>
                <label
                  for="district"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Shop Location District
                </label>
                <select
                  name="district"
                  required={true}
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  class="bg-white border h-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="" selected="">
                    All district
                  </option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Jessore">Jessore</option>
                </select>
              </div>
              <div>
                <label
                  for="city"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Shop Location City
                </label>
                <select
                  required={true}
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  class="bg-white border h-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="" selected="">
                    All city
                  </option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Jessore">Jessore</option>
                </select>
              </div>
              <div>
                <label
                  for="area"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Shop Location Area
                </label>
                <select
                  required={true}
                  name="area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  class="bg-white border h-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="" selected="">
                    All area
                  </option>

                  <option value="Gulshan">Gulshan</option>
                  <option value="Uttara">Uttara</option>
                  <option value="Agrabad">Agrabad</option>
                  <option value="Banani">Banani</option>
                  <option value="Boalia">Boalia</option>
                  <option value="Sadar">Sadar</option>
                  <option value="Road">Road</option>
                  <option value="Mohammadpur">Mohammadpur</option>
                  <option value="Zindabazar">Zindabazar</option>
                  <option value="Mirpur">Mirpur</option>
                  <option value="New Market">New Market</option>
                </select>
              </div>
              <div>
                <label
                  for="activeHour"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Shop Active Hour
                </label>
                <select
                  required={true}
                  name="activeHour"
                  value={activeHour}
                  onChange={(e) => setActiveHour(e.target.value)}
                  class="bg-white border h-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Active hour</option>
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                  <option value="Day-Night">Day-Night</option>
                </select>
              </div>
            </form>
          </div>
          <div className="col-span-1">
            <InstructionCardShopOwner />
          </div>
        </div>
      </div>
    </div>
  );
}
