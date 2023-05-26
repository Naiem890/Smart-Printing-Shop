import React from "react";
import InstructionCard from "./InstructionCard";
import ShopCard from "./ShopCard";

const SearchService = () => {
  return (
    <div className="max-w-[90%] mx-auto mt-10">
      <div>
        <h1 className="text-3xl font-bold">Search Shop</h1>
        <div className="grid grid-cols-3 space-x-16">
          <div className="col-span-2">
            <form class="mt-5 flex flex-col gap-6 items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700 sm:flex-row">
              <label for="city" class="hidden">
                Select city:
              </label>
              <select
                id="city"
                class="bg-white border h-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="all" selected="">
                  All city
                </option>
                <option value="marketing">Marketing UI</option>
                <option value="application">Application UI</option>
                <option value="publisher">Publisher UI</option>
              </select>
              <label for="area" class="hidden">
                Select area:
              </label>
              <select
                id="area"
                class="bg-white border h-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="all" selected="">
                  All area
                </option>
                <option value="marketing">Marketing UI</option>
                <option value="application">Application UI</option>
                <option value="publisher">Publisher UI</option>
              </select>
              <a
                class="inline-flex justify-center h-12 w-full text-center sm:w-auto items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 sm:ml-3"
                href="/login/"
              >
                Search
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true"
                  class="w-4 h-4 ml-1 inline"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  ></path>
                </svg>
              </a>
            </form>
            <div>
              <ul class="flex w-full">
                <li>
                  <input
                    type="radio"
                    id="hosting-small"
                    name="hosting"
                    value="hosting-small"
                    class="hidden peer"
                    required
                    defaultChecked
                  />
                  <label
                    for="hosting-small"
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
                    id="hosting-big"
                    name="hosting"
                    value="hosting-big"
                    class="hidden peer"
                  />
                  <label
                    for="hosting-big"
                    class="inline-flex items-center justify-between p-2 text-gray-500 bg-white  peer-checked:border-b-2 border-gray-400 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <div class="block">
                      <div class="w-full text-lg font-semibold">Printing</div>
                    </div>
                  </label>
                </li>
              </ul>
            </div>
            <div className="mt-10 flex flex-col gap-6 mb-16">
              <ShopCard />
              <ShopCard />
              <ShopCard />
              <ShopCard />
              <ShopCard />
              <ShopCard />
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
