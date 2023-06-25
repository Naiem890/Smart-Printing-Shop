import React, { useEffect, useState } from "react";
import InstructionCardShopOwner from "./InstructionCardShopOwner";
import { toast } from "react-toastify";
import ShopCardWithEditAndDelete from "./ShopCardWithEditAndDelete";
import Swal from "sweetalert2";
import Loader from "../../UI-elements/Loader";
import { useParams } from "react-router-dom";
import { Buffer } from "buffer";
import {
  CheckCircleIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import OrderStatus from "./OrderStatus";

export default function MyOrders() {
  const { shopId } = useParams();
  const [orders, setOrders] = useState(null);
  const [order, setOrder] = useState(null);
  const [orderDocuments, setOrderDocuments] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(false);
  const [reload, setReload] = useState(false);
  const [cust_id] = useState(localStorage.getItem("CUST_ID"));

  useEffect(() => {
    fetch(`http://localhost:3000/api/orders?cust_id=${cust_id}`)
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
        if (selectedOrder) {
          setSelectedOrder((prev) => {
            console.log("prev", prev);
            const updatedOrder = data.find(
              (order) => order.ORDER_ID === prev.ORDER_ID
            );
            console.log("updatedOrder", updatedOrder);
            return updatedOrder || prev;
          });
        }
      });
  }, [shopId, reload]);

  useEffect(() => {
    if (order) {
      handleUpdateOrder("DELIVERED");
    }
  }, [order]);

  const handleClick = (data) => {
    setOrder(data);
  };
  const handleUpdateOrder = (status) => {
    Swal.fire({
      title: "Confirmation",
      html: `<p className:"">Are you sure you want to update the <br> <span className:"bg-gray-400">Order: ${order.ORDER_ID}</span> to ${status}?</p>`,
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
          } else if (
            order.PAYMENT_STATUS == "REJECTED" &&
            !order.ORDER_STATUS == "CANCELED"
          ) {
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
                setOrders((prevOrder) =>
                  prevOrder.filter((pOrder) => {
                    if (pOrder.ORDER_ID === order.ORDER_ID) {
                      return {
                        ...pOrder,
                        orderStatus: status,
                      };
                    } else return pOrder;
                  })
                );
                // setOrders(data);
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
        triggerRefresh();
      });
  };

  const triggerRefresh = () => {
    setReload((prevReload) => !prevReload);
  };

  if (!orders) {
    return <Loader />;
  }

  return (
    <>
      <div className="max-w-[85%] mx-auto mt-10">
        <div>
          <div className="grid grid-cols-12 space-x-16">
            <div className="col-span-11">
              <div className="flex col-span-full justify-between">
                <h1 className="text-3xl font-bold">My Order List</h1>
              </div>
              <div className="mt-10">
                <ul className="flex flex-col gap-5">
                  {!orders.length && (
                    <p className="text-xl font-mono text-gray-500">
                      No order found
                    </p>
                  )}
                  {orders?.map((order) => (
                    <div className="border rounded-lg py-6 px-8 flex gap-8 items-start hover:shadow-md transition-all cursor-pointer font-mono">
                      <div>
                        <h3 className="text-sm">Order ID</h3>
                        <div className="text-lg font-semibold">
                          {order.ORDER_ID}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm">Order Priority</h3>
                        <div className="text-lg font-semibold">
                          {order.ORDER_PRIORITY}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm">Order Status</h3>
                        <div className="text-lg font-semibold">
                          {order.ORDER_STATUS}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm">Order Date</h3>
                        <div className="text-sm font-semibold mt-1 flex flex-col">
                          {new Date(order.ORDER_DATE).toLocaleString()}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm">Payment Status</h3>
                        <div className="text-lg font-semibold">
                          {order.PAYMENT_STATUS}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm">Delivery Time</h3>
                        <div className="text-sm font-semibold">
                          {order.ORDER_DELIVERY_TIME
                            ? new Date(
                                order.ORDER_DELIVERY_TIME
                              ).toLocaleString()
                            : "Not Delivered Yet"}
                        </div>
                      </div>

                      <div className="flex gap-6 ml-auto self-center">
                        {order.ORDER_STATUS.toUpperCase() === "COMPLETED" && (
                          <div onClick={() => handleClick(order)}>
                            <CheckCircleIcon className="w-8 h-8 text-green-600 hover:bg-green-600 hover:text-white rounded-full transition-all" />
                          </div>
                        )}
                        <div className="self-center">
                          <a
                            download={`order_${order.ORDER_ID}.pdf`}
                            href={orderDocuments[order.ORDER_ID]}
                            className="flex items-center gap-2 text-green-600"
                          >
                            <DocumentArrowDownIcon className="h-8 w-8" />
                            {/* <span>Download</span> */}
                          </a>
                        </div>
                        {/* <div className=" self-center">
                          <button
                            onClick={() => {
                              updatedOrder("CANCEL");
                            }}
                            className="flex items-center gap-2 text-red-600"
                          >
                            <NoSymbolIcon className="h-8 w-8" />
                          </button>
                        </div> */}
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
          </div>
        </div>
      </div>
      {showModal && (
        <OrderStatus
          reSet={triggerRefresh}
          selectedOrder={selectedOrder}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
}
