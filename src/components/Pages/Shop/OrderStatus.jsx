import React, { useEffect, useState } from "react";
import Modal from "../../UI-elements/Modal";
import {
  CheckBadgeIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  PrinterIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import Loader from "../../UI-elements/Loader";
import { toast } from "react-toastify";

export default function OrderStatus({ selectedOrder, setShowModal, reSet }) {
  const [order, setOrder] = useState(selectedOrder);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");

  const OrderStages = [
    {
      stageName: "Queued",
      done: false,
      icon: <ClockIcon className="w-6 h-6" />,
    },
    {
      stageName: "Processing",
      done: false,
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

  if (order?.ORDER_STATUS?.toUpperCase() === "CANCELED") {
    OrderStages[0].done = false;
    OrderStages[1].done = false;
    OrderStages[2].done = false;
    OrderStages[3].done = false;
  }

  if (order?.ORDER_STATUS?.toUpperCase() === "QUEUED") {
    OrderStages[0].done = true;
  }
  if (order?.ORDER_STATUS?.toUpperCase() === "PROCESSING") {
    OrderStages[0].done = true;
    OrderStages[1].done = true;
  }
  if (order?.ORDER_STATUS?.toUpperCase() === "COMPLETED") {
    OrderStages[0].done = true;
    OrderStages[1].done = true;
    OrderStages[2].done = true;
  }
  if (order?.ORDER_STATUS?.toUpperCase() === "DELIVERED") {
    OrderStages[0].done = true;
    OrderStages[1].done = true;
    OrderStages[2].done = true;
    OrderStages[3].done = true;
  }

  useEffect(() => {
    console.log("order", order);
    if (paymentStatus == "REJECTED") {
      console.log("inside reject");
      handleUpdateOrder("CANCELED");
    }
    if (paymentStatus == "ACCEPTED") {
      console.log("inside accept");
      handleUpdateOrder("PROCESSING");
    }
    setPaymentStatus("");
    setOrderStatus("");
  }, [paymentStatus]);

  const handleUpdateOrder = (status) => {
    Swal.fire({
      title: "Confirmation",
      html: `<p className:"">Are you sure you want to update the <br> <span className:"bg-gray-400">Order: ${order?.ORDER_ID}</span> to ${status}?</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    })
      .then((result) => {
        if (result.isConfirmed) {
          console.log(order.PAYMENT_STATUS, status);
          if (status == "PROCESSING" && order.PAYMENT_STATUS == "PENDING") {
            toast(
              "First update the payment status to update the order status to Processing!",
              {
                type: "warning",
                theme: "colored",
              }
            );
          } else if (order.PAYMENT_STATUS == "REJECTED" && !order.ORDER_STATUS=="CANCELED") {
            toast("You can't update the status for rejected payment orders!", {
              type: "warning",
              theme: "colored",
            });
          } else {
            fetch(
              `http://localhost:3000/api/orders/update/${order?.ORDER_ID}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderStatus: status }),
              }
            )
              .then((response) => {
                console.log(response);
                if (response.ok) {
                  return response.json(); // Parse the response body as JSON
                } else {
                  throw new Error("Failed to update order status");
                }
              })
              .then((data) => {
                // Update the order status in the updatedOrder state
                setOrder((prevOrder) => ({
                  ...prevOrder,
                  ORDER_STATUS: status,
                }));
                toast(`Order status updated to ${status}`, {
                  type: "success",
                  theme: "colored",
                });
              })
              .catch((error) => {
                // Handle any errors that occurred during the requestx
                Swal.fire("Error", error.message, "error");
              });
          }
        }
      })
      .then(() => {
        reSet();
        setOrderStatus(status);
      });
  };

  if (!OrderStages.length) {
    return <Loader />;
  }

  const handleUpdatePayment = async (paymentStatus) => {
    const paymentId = order.PAYMENT_TRANSFER_ID;
    Swal.fire({
      title: "Confirmation",
      text: `Are you sure you want to update the payment status to "${paymentStatus}"? This action cannot be reverted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await fetch(
              `http://localhost:3000/api/payment/update/${paymentId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ paymentStatus }),
              }
            );

            const data = await response.json();

            if (response.ok) {
              toast(data.message, {
                type: "success",
                theme: "colored",
              });

              setOrder((prevOrder) => ({
                ...prevOrder,
                PAYMENT_STATUS: paymentStatus,
              }));
            } else {
              toast(data.message, {
                type: "error",
                theme: "colored",
              });
            }
          } catch (error) {
            toast("An error occurred while updating the payment.", {
              type: "error",
              theme: "colored",
            });
          }
        }
      })
      .then(() => {
        reSet();
        setPaymentStatus(paymentStatus);
      });
  };

  return (
    <Modal className="max-w-3xl" setShowModal={setShowModal}>
      <div class="px-6 py-6 lg:px-8">
        <h3 class="mb-4 text-xl  font-medium text-gray-900 dark:text-white">
          Update order status
        </h3>

        <div className="my-10">
          <ol class="flex items-center w-full justify-center">
            {OrderStages.map((orderStage, i) => {
              let isProcessingStage =
                !orderStage.done && OrderStages[i - 1]?.done;
              let isLastDoneStage =
                orderStage.done && !OrderStages[i + 1]?.done;
              return (
                <li
                  key={i}
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
                      onClick={
                        isProcessingStage
                          ? () =>
                              handleUpdateOrder(
                                orderStage.stageName.toUpperCase()
                              )
                          : undefined
                      }
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
                </li>
              );
            })}
          </ol>
        </div>
        <div className="flex gap-4">
          <div className="border transition-all cursor-pointer hover:shadow-md p-6 w-full rounded-lg">
            <h3 className="text-sm">Order Status</h3>
            <div className="text-lg font-semibold">{order.ORDER_STATUS}</div>
          </div>
          <div className="border transition-all cursor-pointer hover:shadow-md p-6 w-full rounded-lg">
            <h3 className="text-sm">Order Amount</h3>
            <div className="text-lg font-semibold">
              {order.ORDER_AMOUNT} BDT
            </div>
          </div>
          <div className="border transition-all cursor-pointer hover:shadow-md p-6 w-full rounded-lg">
            <h3 className="text-sm">Order Priority</h3>
            <div className="text-lg font-semibold">{order?.ORDER_PRIORITY}</div>
          </div>
          <div className="border transition-all cursor-pointer hover:shadow-md p-6 w-full rounded-lg">
            <h3 className="text-sm">Payment Status</h3>
            <div className="text-lg font-semibold">{order.PAYMENT_STATUS}</div>
          </div>
        </div>
        <div className="flex gap-4 transition-all cursor-pointer hover:shadow-md mt-4 border items-center p-6 rounded-lg">
          <div className="flex gap-10">
            <div>
              <h3 className="text-sm">Transaction Id</h3>
              <div className="text-lg font-semibold mt-1 flex gap-2">
                <span
                  className="text-gray-500 cursor-pointer"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(order.PAYMENT_TRANSFER_ID)
                      .then(() => {
                        toast(`${order.PAYMENT_TRANSFER_ID} copied!`, {
                          type: "info",
                          theme: "colored",
                        });
                      })
                  }
                >
                  #{order.PAYMENT_TRANSFER_ID}
                </span>
              </div>
            </div>
            <div className="">
              <h3 className="text-sm">Payment Amount</h3>
              <div className="text-lg font-semibold mt-1">
                {order.PAYMENT_AMOUNT} BDT
              </div>
            </div>
            <div className="">
              <h3 className="text-sm">Payment Date</h3>
              <div className=" font-semibold mt-1">
                {new Date(order.PAYMENT_DATE).toLocaleString()}
              </div>
            </div>
          </div>
          {order.PAYMENT_STATUS == "PENDING" && (
            <div className="flex ml-auto gap-4">
              <CheckCircleIcon
                onClick={() => handleUpdatePayment("ACCEPTED")}
                className="w-10 h-10 text-green-600 cursor-pointer hover:bg-green-600 hover:text-white rounded-full transition-all"
              />
              <XCircleIcon
                onClick={() => handleUpdatePayment("REJECTED")}
                className="w-10 h-10 text-red-600 cursor-pointer hover:bg-red-600 hover:text-white rounded-full transition-all"
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
