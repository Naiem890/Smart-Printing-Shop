import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section class="bg-white dark:bg-gray-900">
      <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-12 lg:py-16 lg:grid-cols-2">
        <div class="mr-auto place-self-center col-span-2 lg:col-span-1">
          <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
            Simplify Your Printing Experience
          </h1>
          <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            From document submission to seamless printing fulfillment,
            individuals and businesses worldwide rely on PrintEase to simplify
            their printing process
          </p>
          <div class="flex flex-col gap-6 items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700 sm:flex-row">
            <label for="city" class="hidden">
              Select city:
            </label>
            <select
              id="city"
              class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="all" selected="">
                All area
              </option>
              <option value="marketing">Marketing UI</option>
              <option value="application">Application UI</option>
              <option value="publisher">Publisher UI</option>
            </select>
            <Link
              class="inline-flex justify-center  w-full text-center sm:w-auto items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 sm:ml-3"
              to="/search"
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
            </Link>
          </div>
        </div>
        <div class="hidden lg:mt-0 col-span-2 lg:col-span-1 lg:flex">
          <img
            className="block w-full"
            src="/images/authentication/login-illustration.png"
            alt="mockup"
          />
        </div>
      </div>
    </section>
  );
}
