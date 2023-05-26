import React, { useEffect, useState } from "react";
import { ClockIcon, MapPinIcon, StarIcon } from "@heroicons/react/24/solid";

export default function Shop() {
  return (
    <div className="max-w-[90%] mx-auto mt-10">
      <div>
        <h1 className="text-3xl font-bold">Shop Details</h1>
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
                Ekota printing shop
              </h1>
              <div className="flex gap-2 items-center mt-4">
                <span>
                  <MapPinIcon className="h-6 w-6 text-slate-500" />
                </span>
                <p className="text-xl">Kajla, opposite of RU gate</p>
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
                <p className="text-xl">3 works in queue</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
