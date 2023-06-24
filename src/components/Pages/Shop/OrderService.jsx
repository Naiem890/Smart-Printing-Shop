import React, { useEffect, useState } from "react";
import InstructionCardShopOwner from "./InstructionCardShopOwner";
import { toast } from "react-toastify";
import {
  ArrowLeftIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../UI-elements/Loader";
import Modal from "../../UI-elements/Modal";

export default function OrderService() {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const navigate = useNavigate();
  const [fileUploadError, setFileUploadError] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [paymentId, setPaymentId] = useState("");
  const [highPriority, setHighPriority] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/services/${serviceId}`)
      .then((res) => res.json())
      .then((data) => {
        setService(data);
      });
  }, [serviceId]);

  if (!service) {
    return <Loader />;
  }
  let serviceCharge = Math.ceil(
    numberOfPages * service.SERVICE_CHARGE_PER_UNIT
  );
  let platformCharge = Math.ceil(serviceCharge * 0.1);
  let totalCharge =
    serviceCharge +
    platformCharge +
    (highPriority ? Math.ceil(serviceCharge * 0.05) : 0);
  let estimatedTime = numberOfPages * service.ESTIMATED_TIME_IN_MIN_REQUIRED;

  console.log(serviceCharge, totalCharge, Math.ceil(serviceCharge * 0.05));
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setFileUploadError(false);
    var reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onloadend = function () {
      var count = reader.result.match(/\/Type[\s]*\/Page[^s]/g).length;
      console.log("Number of Pages:", count);

      setNumberOfPages(count);
    };
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const custId = localStorage.getItem("CUST_ID");

    console.log("selectedFile", selectedFile);
    if (!selectedFile) {
      toast("Please upload your file!!!", {
        type: "error",
        theme: "colored",
      });
      setFileUploadError(true);
      return;
    }

    if (!custId) {
      toast("Please login to order!!!", {
        type: "error",
        theme: "colored",
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    }

    const orderData = {
      orderDocument: selectedFile,
      orderPriority: highPriority,
      orderAmount: totalCharge,
      orderDate: new Date(),
      cust_id: custId,
    };

    console.log(orderData);

    const formData = new FormData();
    formData.append("orderDocument", selectedFile);
    formData.append("orderPriority", highPriority);
    formData.append("orderAmount", totalCharge);
    formData.append("orderDate", new Date());
    formData.append("cust_id", custId);
    formData.append("serviceId", serviceId);
    formData.append("paymentId", paymentId);

    try {
      const response = await fetch("http://localhost:3000/api/order/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Order placed successfully");

        toast("Order placed successfully!", {
          type: "success",
          theme: "colored",
        });
        // Handle success scenario
      } else {
        const data = await response.json();
        console.error(data.message || "Error placing order");
        // Handle error scenario
        toast(data.message || "Error placing order!", {
          type: "error",
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast("Error placing order!", {
        type: "error",
        theme: "colored",
      });
      // Handle error scenario
    }

    setShowModal((prev) => !prev);
  };

  return (
    <>
      <div className="max-w-[85%] mx-auto mt-10">
        <div>
          <div className="grid grid-cols-3 space-x-16">
            <div className="col-span-2">
              <form
                // onSubmit={handlePlaceOrder}
                className="grid grid-cols-2 gap-10 "
              >
                <div className="flex col-span-full justify-between">
                  <div className="flex gap-8 items-center">
                    <Link onClick={() => navigate(-1)} className="">
                      <ArrowLeftIcon className="h-6 w-6" />
                    </Link>
                    <h1 className="text-3xl font-bold">Place Order</h1>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <label
                      for="district"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Service name
                    </label>
                    <select
                      name="district"
                      required={true}
                      disabled={true}
                      value={service.SERVICE_NAME}
                      class="bg-gray-200 cursor-not-allowed border h-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                    >
                      <option value="Printing">Printing</option>
                      <option value="Book Binding">Book Binding</option>
                      <option value="Laminating">Laminating</option>
                    </select>
                  </div>
                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Upload Document
                    </label>
                    <div class="flex items-center justify-center w-full">
                      <label
                        for="dropzone-file"
                        class="flex flex-col items-center justify-center w-full h-50 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      >
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            aria-hidden="true"
                            class="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span class="font-semibold">Click to upload</span>{" "}
                            or drag and drop
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            PDF only
                          </p>
                        </div>
                        <input
                          type="file"
                          id="dropzone-file"
                          name="shopImage"
                          class="hidden"
                          accept="application/pdf"
                          onChange={handleFileChange}
                        />
                        {fileUploadError && (
                          <div className="text-red-500">
                            Please select any pdf file
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                  <label class="relative inline-flex items-center mr-5  cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      checked={highPriority}
                      onChange={() => setHighPriority((prev) => !prev)}
                    />
                    <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    <span class="ml-3 text-md font-medium text-green-600 dark:text-gray-300">
                      Make this order higher priority
                    </span>
                  </label>
                </div>

                <div className="flex flex-col">
                  {/* <div className="flex justify-between font-mono mt-6 border px-6 py-3 hover:shadow-md cursor-pointer transition-all">
                  <h3 className="text-xl font-semibold">Order Date & Time: </h3>
                  <span>{new Date().toLocaleString()}</span>
                </div> */}
                  <div className="flex justify-between font-mono border px-6 py-3 hover:shadow-md cursor-pointer transition-all">
                    <h3 className="text-xl font-semibold">Number of pages: </h3>
                    <span>
                      {numberOfPages} {numberOfPages > 1 ? "Pages" : "Page"}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono border px-6 py-3 hover:shadow-md cursor-pointer transition-all">
                    <h3 className="text-xl font-semibold">Estimated Time: </h3>
                    <span>
                      {`${numberOfPages} x ${service?.ESTIMATED_TIME_IN_MIN_REQUIRED} Min = `}
                      {estimatedTime} Min
                    </span>
                  </div>
                  <div className="flex justify-between font-mono border px-6 py-3 hover:shadow-md cursor-pointer transition-all">
                    <h3 className="text-xl font-semibold">Order Amount: </h3>
                    <span>
                      {`${numberOfPages} x ${service?.SERVICE_CHARGE_PER_UNIT} BDT = `}
                      {serviceCharge} BDT
                    </span>
                  </div>
                  <div className="flex justify-between font-mono border px-6 py-3 hover:shadow-md cursor-pointer transition-all">
                    <h3 className="text-xl font-semibold">Platform Charge: </h3>
                    <span>
                      {`${serviceCharge} x 10% = `}
                      {platformCharge} BDT
                    </span>
                  </div>
                  {highPriority && (
                    <div className="flex text-green-500 justify-between font-mono border px-6 py-3 hover:shadow-md cursor-pointer transition-all">
                      <h3 className="text-xl font-semibold">
                        High Priority Charge:{" "}
                      </h3>
                      <span>
                        {`${serviceCharge} x 5% = `}
                        {Math.ceil(serviceCharge * 0.05)} BDT
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-mono border px-6 py-3 hover:shadow-md cursor-pointer transition-all">
                    <h3 className="text-xl font-semibold">Total Charge: </h3>
                    <span>{totalCharge} BDT</span>
                  </div>

                  <div className="col-span-full mt-10 ml-auto">
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedFile) {
                          toast("Please upload your file!!!", {
                            type: "error",
                            theme: "colored",
                          });
                        } else setShowModal((prev) => !prev);
                      }}
                      class="inline-flex justify-center h-12 w-full text-center sm:w-auto items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 "
                    >
                      Confirm Order
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-span-1">
              <InstructionCardShopOwner />
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal setShowModal={setShowModal}>
          <div class="px-6 py-6 lg:px-8">
            <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Make payment & Confirm order
            </h3>
            <form class="space-y-6" onSubmit={handlePlaceOrder} action="#">
              <div>
                <img
                  className="block"
                  src="/images/payment/makePayment2.png"
                  alt=""
                />
              </div>
              <div className="border flex items-center justify-between px-4 p-3 rounded-lg bg-[#DF146E] text-white text-xl font-mono font-bold">
                <span>Bkash: 01790732717</span>
                <ClipboardDocumentListIcon
                  onClick={() =>
                    navigator.clipboard.writeText("01790732717").then(() => {
                      toast("Bkash Number copied!!!", {
                        type: "info",
                        theme: "colored",
                      });
                    })
                  }
                  className="h-6 w-6 cursor-pointer"
                />
              </div>
              <div>
                <label
                  for="paymentId"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Payment Transaction Id
                </label>
                <input
                  type="text"
                  name="paymentId"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Enter the payment transaction ID"
                  required
                />
              </div>

              <button
                type="submit"
                class="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg px-5 py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Place Order
              </button>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
}
