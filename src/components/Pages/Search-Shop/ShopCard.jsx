import React from "react";

export default function ShopCard() {
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
            Ekota printing shop
          </h3>
          <p>Kajla, opposite of RU gate</p>
        </div>
        <a
          class="inline-flex justify-center ml-auto h-12 w-full text-center sm:w-auto items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-5"
          href="/shop/"
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
      </div>
    </div>
  );
}
