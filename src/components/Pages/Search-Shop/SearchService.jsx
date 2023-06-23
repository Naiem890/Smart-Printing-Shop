import React, { useEffect, useState } from "react";
import InstructionCard from "./InstructionCard";
import ShopCard from "./ShopCard";
import LoaderCircle from "../../UI-elements/LoaderCircle";

const SearchService = () => {
  const [shops, setShops] = useState([]);

  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");

  const [searchBy, setSearchBy] = useState("");

  useEffect(() => {
    let queryString = `?`;

    if (district) queryString += `district=${district}&`;
    if (city) queryString += `city=${city}&`;
    if (area) queryString += `area=${area}&`;
    if (searchBy) queryString += `search_by_service=${searchBy}&`;

    fetch(`http://localhost:3000/api/shops${queryString}`)
      .then((res) => res.json())
      .then((data) => setShops(data));
  }, [district, city, area, searchBy]);

  return (
    <div className="max-w-[85%] mx-auto mt-10">
      <div>
        <h1 className="text-3xl font-bold">Search Shop</h1>
        <div className="grid grid-cols-3 space-x-16">
          <div className="col-span-2">
            <form class="mt-5 flex flex-col gap-6 items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700 sm:flex-row">
              <label for="city" class="hidden">
                Select district:
              </label>
              <select
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
              <label for="city" class="hidden">
                Select city:
              </label>
              <select
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
              <label for="area" class="hidden">
                Select area:
              </label>
              <select
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
            </form>
            <div onChange={(e) => setSearchBy(e.target.value)}>
              <ul class="flex w-full gap-2 py-4">
                <li>
                  <input
                    type="radio"
                    id="all"
                    name="service"
                    value=""
                    class="hidden peer"
                    defaultChecked
                  />
                  <label
                    for="all"
                    class="inline-flex items-center justify-between p-2 text-gray-500 bg-white  peer-checked:border-b-2 border-gray-400 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <div class="block">
                      <div class="w-full text-lg font-semibold px-3">All</div>
                    </div>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="printing"
                    name="service"
                    value="printing"
                    class="hidden peer"
                  />
                  <label
                    for="printing"
                    class="inline-flex items-center justify-between p-2 text-gray-500 bg-white  peer-checked:border-b-2 border-gray-400 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <div class="block">
                      <div class="w-full text-lg font-semibold">Printing</div>
                    </div>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="book-binding"
                    name="service"
                    value="book binding"
                    class="hidden peer"
                  />
                  <label
                    for="book-binding"
                    class="inline-flex items-center justify-between p-2 text-gray-500 bg-white  peer-checked:border-b-2 border-gray-400 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <div class="block">
                      <div class="w-full text-lg font-semibold">
                        Book Binding
                      </div>
                    </div>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="laminating"
                    name="service"
                    value="laminating"
                    class="hidden peer"
                  />
                  <label
                    for="laminating"
                    class="inline-flex items-center justify-between p-2 text-gray-500 bg-white  peer-checked:border-b-2 border-gray-400 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <div class="block">
                      <div class="w-full text-lg font-semibold">Laminating</div>
                    </div>
                  </label>
                </li>
              </ul>
            </div>
            <div className="mt-10 flex flex-col gap-6 mb-16">
              {!shops?.data?.length && !shops?.dataFetched && <LoaderCircle />}
              {!shops?.data?.length && shops?.dataFetched && (
                <p>No Shop Found!</p>
              )}
              {shops?.data?.map((shop) => (
                <ShopCard key={shop.SHOP_ID} shop={shop} />
              ))}
            </div>
          </div>
          <div className="col-span-1">
            <InstructionCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchService;
