import React, { useEffect, useState } from "react";
import InstructionCardShopOwner from "./InstructionCardShopOwner";
import { toast } from "react-toastify";
import ShopCardWithEditAndDelete from "./ShopCardWithEditAndDelete";
import Swal from "sweetalert2";
import Loader from "../../UI-elements/Loader";
import { useParams } from "react-router-dom";
import { Buffer } from "buffer";
import {
  CheckBadgeIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  PencilIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import Modal from "../../UI-elements/Modal";

export default function OrderList() {
  const { shopId } = useParams();
  const [orders, setOrders] = useState(null);
  const [orderDocuments, setOrderDocuments] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/api/orders?shop_id=${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        const orderDocs = {};
        data.forEach((order) => {
          const base64doc = Buffer.from(order.ORDER_DOCUMENT.data).toString(
            "base64"
          );
          orderDocs[
            order.ORDER_ID
          ] = `data:application/pdf;base64,${base64doc}`;
        });
        setOrderDocuments(orderDocs);
      });
  }, []);

  const handleDelete = (shopId) => {
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
          `http://localhost:3000/api/shops/${shopId}`,
          {
            method: "DELETE",
          }
        );

        const result = await response.json();
        console.log("Success:", result);
        if (result.shopDeleted) {
          toast("Shop Deleted Successfully!!", {
            autoClose: 3000,
            type: "success",
            theme: "colored",
          });

          // setTimeout(() => {
          //   window.location.reload(false);
          // }, 3000); // Delay the reload by 3000 milliseconds (3 seconds)
        }
      }
    });
  };

  if (!orders) {
    return <Loader />;
  }

  const OrderStages = [
    {
      stageName: "Queued",
      done: true,
      icon: <ClockIcon className="w-6 h-6" />,
    },
    {
      stageName: "Processing",
      done: true,
      icon: <PrinterIcon className="w-6 h-6" />,
    },
    {
      stageName: "Completed",
      done: false,
      icon: <ClipboardDocumentCheckIcon className="w-6 h-6" />,
    },
    {
      stageName: "Delivered",
      done: false,
      isLast: true,
      icon: <CheckBadgeIcon className="w-6 h-6" />,
    },
  ];

  return (
    <>
      <div className="max-w-[85%] mx-auto mt-10">
        <div>
          <div className="grid grid-cols-3 space-x-16">
            <div className="col-span-2">
              <div className="flex col-span-full justify-between">
                <h1 className="text-3xl font-bold">Order List</h1>
              </div>
              <div className="mt-10">
                <ul className="flex flex-col gap-5">
                  {orders.map((order) => (
                    <div className="border py-6 px-8 flex items-center hover:shadow-md transition-all cursor-pointer font-mono">
                      <div>
                        <h3 className="text-sm">Order ID</h3>
                        <div className="text-lg font-semibold">
                          {order.ORDER_ID}
                        </div>
                      </div>
                      <div className="ml-16">
                        <h3 className="text-sm">Order Priority</h3>
                        <div className="text-lg font-semibold">
                          {order.ORDER_PRIORITY}
                        </div>
                      </div>
                      <div className="ml-16">
                        <h3 className="text-sm">Order Status</h3>
                        <div className="text-lg font-semibold">
                          {order.ORDER_STATUS}
                        </div>
                      </div>
                      <div className="ml-16">
                        <h3 className="text-sm">Order Date</h3>
                        <div className="text-lg font-semibold">
                          {new Date(order.ORDER_DATE).toLocaleString()}
                        </div>
                      </div>

                      <div className="ml-auto ">
                        <a
                          download={`order_${order.ORDER_ID}.pdf`}
                          href={orderDocuments[order.ORDER_ID]}
                          className="flex items-center gap-2 text-green-600"
                        >
                          <DocumentArrowDownIcon className="h-8 w-8" />
                          {/* <span className="">Download</span> */}
                        </a>
                      </div>
                      <div className="ml-6">
                        <div
                          onClick={() => setShowModal((prev) => !prev)}
                          className="flex items-center gap-2 border-2 rounded-full border-blue-200  w-10 h-10  justify-center  text-blue-600"
                        >
                          <PencilIcon className="h-6 w-6" />
                          {/* <span className="">Download</span> */}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* {shops.map((shop) => (
                <ShopCardWithEditAndDelete
                  handleDelete={handleDelete}
                  key={shop.SHOP_ID}
                  shop={shop}
                />
              ))} */}
                </ul>
              </div>
            </div>
            <div className="col-span-1">
              <InstructionCardShopOwner />
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal className="max-w-xl" setShowModal={setShowModal}>
          <div class="px-6 py-6 lg:px-8">
            <h3 class="mb-4 text-xl  font-medium text-gray-900 dark:text-white">
              Update order status
            </h3>

            <div className="my-10">
              <ol class="flex items-center w-full justify-center">
                {OrderStages.map((orderStage, i) => {
                  let isProcessingStage =
                    !orderStage.done && OrderStages[i - 1].done;
                  let isLastDoneStage =
                    orderStage.done && !OrderStages[i + 1].done;
                  return (
                    <li
                      class={`flex flex-col justify-center ${
                        !orderStage.isLast && "w-full"
                      } ${
                        orderStage.done
                          ? "text-green-600 dark:text-green-500"
                          : "text-gray-600 dark:text-gray-500 cursor-pointer"
                      }`}
                    >
                      <div
                        className={`${
                          !orderStage.isLast &&
                          "after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block"
                        } ${
                          orderStage.done
                            ? "dark:after:border-green-600 after:border-green-100"
                            : "dark:after:border-gray-800 after:border-gray-100"
                        } ${
                          isLastDoneStage && "after:border-dotted"
                        } flex items-center`}
                        title={orderStage.stageName}
                      >
                        <span
                          class={`flex items-center justify-center w-10 h-10 ${
                            orderStage.done
                              ? "bg-green-100 dark:bg-green-800"
                              : "bg-gray-100 dark:bg-gray-800"
                          } ${
                            isProcessingStage &&
                            "outline-dotted outline-3  outline-offset-3 outline-green-400"
                          }
                          rounded-full lg:h-12 lg:w-12  shrink-0`}
                        >
                          {orderStage.icon}
                        </span>
                      </div>
                      {/* <span className="mt-2 font-mono font-bold">
                      {orderStage.stageName}
                    </span> */}
                    </li>
                  );
                })}
                {/* <li class="flex flex-col justify-center w-full text-blue-600 dark:text-blue-500 ">
                  <div className="after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-blue-800 flex items-center">
                    <span class="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full lg:h-12 lg:w-12 dark:bg-blue-800 shrink-0">
                      <svg
                        aria-hidden="true"
                        class="w-5 h-5 text-blue-600 lg:w-6 lg:h-6 dark:text-blue-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </div>
                  <span className="mt-2 font-mono font-bold">Queued</span>
                </li>
                <li class="flex flex-col justify-center w-full text-gray-600 dark:text-gray-500 ">
                  <div className="after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-blue-800 flex items-center">
                    <span class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-blue-800 shrink-0">
                      <svg
                        aria-hidden="true"
                        class="w-5 h-5 text-gray-500 lg:w-6 lg:h-6 dark:text-gray-100"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </div>
                  <span className="mt-2 font-mono font-bold">Queued</span>
                </li>

                <li class="flex flex-col justify-center text-gray-600 dark:text-gray-500 ">
                  <div className="dark:after:border-blue-800 flex items-center">
                    <span class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-blue-800 shrink-0">
                      <svg
                        aria-hidden="true"
                        class="w-5 h-5 text-gray-500 lg:w-6 lg:h-6 dark:text-gray-100"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </div>
                  <span className="mt-2 font-mono font-bold">Queued</span>
                </li> */}
              </ol>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
