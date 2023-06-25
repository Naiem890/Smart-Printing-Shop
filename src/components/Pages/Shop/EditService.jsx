import React, { useEffect, useState } from "react";
import InstructionCardShopOwner from "./InstructionCardShopOwner";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Buffer } from "buffer";
import Loader from "../../UI-elements/Loader";
import Swal from "sweetalert2";

export default function EditService() {
  // service_name service_charge_per_unit estimated_time_in_min_required service_availability
  const [shopId] = useState(localStorage.getItem("SHOP_ID"));
  const [shop, setShop] = useState(null);
  const [services, setServices] = useState(null);
  const [type, setType] = useState("");
  const [chargePerUnit, setChargePerUnit] = useState(1);
  const [eta, setEta] = useState(1);
  const [availability, setAvailability] = useState(1);
  const [editorMode, setEditorMode] = useState("");
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/api/shops/${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        setShop(data);
        setServices(data.SHOP_SERVICES);
      });
  }, [shopId, reload]);

  useEffect(() => {
    if (editorMode) {
      const serviceData = services.find(
        (service) => service.SERVICE_ID === editorMode
      );
      console.log("serviceData", serviceData);
      setType(serviceData.SERVICE_NAME);
      setChargePerUnit(serviceData.SERVICE_CHARGE_PER_UNIT);
      setEta(serviceData.ESTIMATED_TIME_IN_MIN_REQUIRED);
      setAvailability(serviceData.SERVICE_AVAILABILITY);
    } else {
      setType("");
      setChargePerUnit(1);
      setEta(1);
      setAvailability(1);
    }
  }, [editorMode]);

  if (!services) {
    return <Loader />;
  }

  const handleUpdateService = async (e) => {
    e.preventDefault();

    const updatedService = {
      service_id: editorMode,
      type,
      chargePerUnit,
      eta,
      availability,
    };

    console.log("updatedService", updatedService);

    const response = await fetch(`http://localhost:3000/api/service/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedService),
    });

    const result = await response.json();
    console.log("Success:", result);
    if (result.serviceUpdated) {
      toast("Service Updated Successfully!!", {
        autoClose: 3000,
        type: "success",
        theme: "colored",
      });

      setReload((prev) => !prev);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    const newService = {
      shop_id: shopId,
      type,
      chargePerUnit,
      eta,
      availability,
    };

    console.log("newService", newService);

    try {
      const response = await fetch(`http://localhost:3000/api/service/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newService),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (data.serviceCreated && data.providesCreated) {
        toast("Service Created Successfully!", {
          autoClose: 3000,
          theme: "colored",
          type: "success",
        });

        setReload((prev) => !prev);
      } else if (data.serviceCreated) {
        toast("Service not created properly!", {
          autoClose: 3000,
          theme: "colored",
          type: "warning",
        });

        setReload((prev) => !prev);
      } else {
        toast("Failed to create service.", {
          autoClose: 3000,
          theme: "colored",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      toast("An error occurred while creating the service.", {
        autoClose: 3000,
        type: "error",
        theme: "colored",
      });
    }
  };

  // ...

  const handleDelete = async (e) => {
    e.preventDefault();
    console.log("service_id", editorMode);

    // Display confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete the service. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/service/delete/${editorMode}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();
          console.log("Response:", data);

          if (data.serviceDeleted) {
            toast("Service Deleted Successfully!", {
              autoClose: 3000,
              type: "success",
              theme: "colored",
            });

            setReload((prev) => !prev);
            setEditorMode("");
          } else {
            toast("Failed to delete service.", {
              autoClose: 3000,
              type: "error",
              theme: "colored",
            });
          }
        } catch (error) {
          console.error(error);
          toast("An error occurred while deleting the service.", {
            autoClose: 3000,
            type: "error",
            theme: "colored",
          });
        }
      }
    });
  };

  return (
    <div className="max-w-[85%] mx-auto mt-10">
      <div>
        <div className="grid grid-cols-3">
          <div className="flex col-span-2 justify-between mb-10">
            <div className="flex gap-8 items-center">
              <Link onClick={() => navigate(-1)} className="">
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <h1 className="text-3xl font-bold">
                Shop {editorMode ? "Edit" : "Add"} Service
              </h1>
            </div>
          </div>
          <div className="col-span-1 ml-10 mb-10">
            <div className="flex flex-col h-12">
              <h1 className="text-2xl font-bold">Service List</h1>
              <p className="text-gray-500">Select any service to update info</p>
            </div>
          </div>
          <div className="col-span-2">
            <form
              onSubmit={editorMode ? handleUpdateService : handleAddService}
              className="grid grid-cols-1 gap-10"
            >
              <div className="flex flex-col gap-6">
                <div>
                  <label
                    for="serviceType"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Service Type
                  </label>
                  <select
                    name="serviceType"
                    required={true}
                    value={type}
                    disabled={editorMode}
                    onChange={(e) => setType(e.target.value)}
                    class={` border h-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      editorMode ? "bg-gray-200 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="">Select service type</option>
                    {editorMode
                      ? services.map((service) => (
                          <option value={service.SERVICE_NAME}>
                            {service.SERVICE_NAME}
                          </option>
                        ))
                      : ["Printing", "Book Binding", "Laminating"].map(
                          (serviceTypeName) => {
                            if (
                              !services.some((service) =>
                                service.SERVICE_NAME.includes(serviceTypeName)
                              )
                            ) {
                              return (
                                <option value={serviceTypeName}>
                                  {serviceTypeName}
                                </option>
                              );
                            }
                          }
                        )}
                  </select>
                </div>
                <div>
                  <label
                    for="chargePerUnit"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Charge Per Unit (BDT)
                  </label>
                  <input
                    type="number"
                    min={1}
                    name="chargePerUnit"
                    value={chargePerUnit}
                    onChange={(e) => setChargePerUnit(+e.target.value)}
                    id="chargePerUnit"
                    class="bg-gray-50 border h-12 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="eg: 10"
                    required={true}
                  />
                </div>
                <div>
                  <label
                    for="chargePerUnit"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    ETA Per Unit (Min)
                  </label>
                  <input
                    type="number"
                    name="eta"
                    value={eta}
                    min={1}
                    onChange={(e) => setEta(+e.target.value)}
                    id="eta"
                    class="bg-gray-50 border h-12 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="eg: 2"
                    required={true}
                  />
                </div>
                <div class="flex items-center">
                  <label class="relative inline-flex items-center mr-5 cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      checked={availability ? true : false}
                      onChange={() => setAvailability((prev) => (prev ? 0 : 1))}
                    />
                    <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Service is {availability ? "available" : "unavailable"}
                    </span>
                  </label>
                </div>
              </div>
              <div className="">
                <button
                  type="submit"
                  class={`inline-flex justify-center h-12 w-full text-center sm:w-auto items-center text-white ${
                    editorMode
                      ? "bg-blue-700 hover:bg-blue-800"
                      : "bg-green-700 hover:bg-green-800"
                  } focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 sm:mr-3`}
                >
                  {editorMode ? "Update" : "Add"} Service
                </button>
                {editorMode && (
                  <button
                    onClick={handleDelete}
                    class={`inline-flex justify-center h-12 w-full text-center sm:w-auto items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 sm:mr-3`}
                  >
                    Delete Service
                  </button>
                )}
                {editorMode && (
                  <button
                    onClick={() => setEditorMode(false)}
                    class={`inline-flex justify-center h-12 w-full text-center sm:w-auto items-center text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 sm:mr-3`}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="col-span-1 ml-10">
            <ul className="flex flex-col gap-6 mt-6">
              <button
                onClick={() => setEditorMode("")}
                className="p-4 text-green-600 flex items-center justify-center hover:shadow-lg font-mono font-bold transition-all cursor-pointer rounded-md border-2 border-dashed border-green-200 border-spacing-11"
              >
                + Add Service
              </button>
              {services.map((service) => (
                <li key={service.SERVICE_ID}>
                  <input
                    type="radio"
                    id={service.SERVICE_NAME}
                    name="hosting"
                    value={service.SERVICE_ID}
                    checked={service.SERVICE_ID === editorMode}
                    class="hidden peer"
                    onClick={(e) => {
                      setEditorMode((prevID) =>
                        prevID === service.SERVICE_ID ? "" : service.SERVICE_ID
                      );
                    }}
                  />
                  <label
                    for={service.SERVICE_NAME}
                    class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:shadow-xl transition-all dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <div class="block">
                      <div class="w-full text-xl mb-2 font-semibold">
                        {service.SERVICE_NAME}
                      </div>
                      <div class="w-full text-gray-500 font-mono">
                        Per unit charge: {service.SERVICE_CHARGE_PER_UNIT} BDT
                      </div>
                      <div class="w-full text-gray-500 font-mono">
                        ETA: {service.ESTIMATED_TIME_IN_MIN_REQUIRED} Min/Unit
                      </div>
                      <div
                        className={`w-full mt-1 ${
                          service.SERVICE_AVAILABILITY
                            ? "text-green-500"
                            : "text-red-500"
                        } font-mono`}
                      >
                        Service{" "}
                        {service.SERVICE_AVAILABILITY
                          ? "Available"
                          : "Unavailable"}
                      </div>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
