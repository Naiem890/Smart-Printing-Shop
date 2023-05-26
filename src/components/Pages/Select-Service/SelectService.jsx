import React from "react";
import ServiceCard from "./ServiceCard";

const services = [
  { name: "Printing", image: "/images/printimage.png" },
  { name: "Printing", image: "/images/printimage.png" },
  { name: "Printing", image: "/images/printimage.png" },
];

const SelectService = () => {
  return (
    <div className="max-w-4xl mt-10 mx-auto">
      <h1 className="text-3xl font-bold">Select Services</h1>
      <div className="grid grid-cols-3 my-10 gap-8">
        {services.map((service) => (
          <ServiceCard service={service} />
        ))}
      </div>
    </div>
  );
};

export default SelectService;
