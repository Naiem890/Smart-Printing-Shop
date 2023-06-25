import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = ({ role, handleLogout }) => {
  return (
    <nav class="bg-white border-gray-200 dark:bg-gray-900">
      <div class="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" class="flex items-center">
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            PrintEase
          </span>
        </Link>
        <div class="flex md:order-2 gap-6">
          {role == "SHOP_OWNER" ? (
            <div className="flex items-center">
              <Link
                to="/shop-owner/dashboard"
                className="px-4 py-4 flex items-center rounded-md font-bold font-mono hover:bg-slate-200 transition-all"
              >
                Shop Dashboard
              </Link>
              <Link
                onClick={handleLogout}
                className="px-4 py-4 text-red-500 flex items-center rounded-md font-bold font-mono hover:bg-slate-200 transition-all"
              >
                Logout
              </Link>
            </div>
          ) : role == "CUSTOMER" ? (
            <div className="flex items-center">
              <Link
                to="/customer/dashboard"
                className="px-4 py-4 flex items-center rounded-md font-bold font-mono hover:bg-slate-200 transition-all"
              >
                Customer Dashboard
              </Link>
              <Link
                onClick={handleLogout}
                className="px-4 py-4 text-red-500 flex items-center rounded-md font-bold font-mono hover:bg-slate-200 transition-all"
              >
                Logout
              </Link>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-4 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Login/Signup
              </Link>
              <Link
                to="/shop-owner/login"
                type="button"
                class="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-4 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Shop Owner Login/SignUp
              </Link>
            </>
          )}
        </div>
        <div
          class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-cta"
        >
          <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <NavLink
                to="/"
                class="block py-2 pl-3 pr-4 text-gray-900 rounded md:bg-transparent hover:text-blue-700 md:p-0 md:dark:text-blue-500"
                aria-current="page"
              >
                Home
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to="/orders/my-orders"
                class="block py-2 pl-3 pr-4 text-gray-900 rounded md:bg-transparent hover:text-blue-700 md:p-0 md:dark:text-blue-500"
                aria-current="page"
              >
                My Orders
              </NavLink>
            </li> */}
            {/* <li>
              <button
                id="dropdownNavbarLink"
                data-dropdown-toggle="dropdownNavbar"
                class="flex items-center justify-between w-full py-2 pl-3 pr-4  text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
              >
                Shop
                <svg
                  class="w-5 h-5 ml-1"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
              <div
                id="dropdownNavbar"
                class="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
              >
                <ul
                  class="py-2 text-sm text-gray-700 dark:text-gray-400"
                  aria-labelledby="dropdownLargeButton"
                >
                  <li>
                    <Link
                      to="/search"
                      class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Search Shop
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/shop-owner/shop/create"
                      class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Create Shop
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shop-owner/shop-list"
                      class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Shop List
                    </Link>
                  </li>
                </ul>
              </div>
            </li> */}
            <li>
              <a
                href="#about"
                class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
