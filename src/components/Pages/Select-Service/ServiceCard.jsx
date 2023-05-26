import React from "react";

const ServiceCard = ({ service }) => {
  return (
    <div className="h-80 bg-slate-100 flex flex-col justify-center items-center gap-4  cursor-pointer rounded-3xl">
      <div>
        <img src={service.image} alt={service.name} />
      </div>
      <div>
        <h3 className="text-2xl font-medium">{service.name}</h3>
      </div>
    </div>
  );
};

export default ServiceCard;
