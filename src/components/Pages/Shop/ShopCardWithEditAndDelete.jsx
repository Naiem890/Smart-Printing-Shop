import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function ShopCardWithEditAndDelete({ shop }) {
  const handleDelete = () => {
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
          `http://localhost:3000/api/shops/${shop.SHOP_ID}`,
          {
            method: "DELETE",
          }
        );

        const result = await response.json();
        console.log("Success:", result);
        if (result.shopDeleted) {
          toast("Shop Deleted Successfully!!", {
            autoClose: 3000,
          });

          setTimeout(() => {
            window.location.reload(false);
          }, 3000); // Delay the reload by 3000 milliseconds (3 seconds)
        }
      }
    });
  };
  return (
    <div className="shadow border rounded-lg hover:shadow-xl transition-all cursor-pointer">
      <div className="flex px-5 py-4 gap-5 items-center">
        <div className="w-44">
          <img
            src="https://www.ryman.co.uk/media/wysiwyg/-ryman/LandingPages/Print_Services/store_1.jpg"
            alt=""
          />
        </div>
        <div>
          <h3 className="text-2xl tracking-tight font-bold">
            {shop.SHOP_NAME}
          </h3>
          <p>{`${shop.SHOP_LOCATION_AREA}, ${shop.SHOP_LOCATION_CITY}, ${shop.SHOP_LOCATION_DISTRICT}`}</p>
        </div>
        <div className="ml-auto">
          <div className="flex flex-col">
            <a
              class="inline-flex justify-center h-12 w-full text-center sm:w-auto items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-5"
              href={`/shop/${shop.SHOP_ID}`}
            >
              Visit store
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
            <div className="flex gap-5">
              <Link
                to={`/shop-owner/edit-shop/${shop.SHOP_ID}`}
                class="inline-flex justify-center ml-auto h-12 w-full text-center sm:w-auto items-center text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-5"
              >
                Edit Store
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
              <button
                onClick={handleDelete}
                class="inline-flex justify-center ml-auto h-12 w-full text-center sm:w-auto items-center text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-5"
              >
                Delete Store
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
