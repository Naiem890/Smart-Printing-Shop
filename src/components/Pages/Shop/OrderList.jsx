import React, { useEffect, useState } from "react";
import InstructionCardShopOwner from "./InstructionCardShopOwner";
import { toast } from "react-toastify";
import ShopCardWithEditAndDelete from "./ShopCardWithEditAndDelete";
import Swal from "sweetalert2";
import Loader from "../../UI-elements/Loader";
import { useParams } from "react-router-dom";
import { Buffer } from "buffer";
import {
  DocumentArrowDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import OrderStatus from "./OrderStatus";

export default function OrderList() {
  const [shopId] = useState(localStorage.getItem("SHOP_ID"));

  const [orders, setOrders] = useState(null);
  const [orderDocuments, setOrderDocuments] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(false);
  const [reload, setReload] = useState(false);

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

  const handleDelete = (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          fetch(`http://localhost:3000/api/orders/${orderId}`, {
            method: "DELETE",
          }).then(async (response) => {
            const result = await response.json();
            if (response.status == 200) {
              toast(result.message, {
                type: "success",
                theme: "colored",
              });
            } else {
              toast(result.message, {
                type: "error",
                theme: "colored",
              });
            }
            return result;
          });
        }
      })
      .then((data) => {
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
                <h1 className="text-3xl font-bold">Order List</h1>
              </div>
              <div className="mt-10">
                <ul className="flex flex-col gap-5">
                  {!orders.length && (
                    <p className="text-xl font-mono text-gray-500">
                      No order found
                    </p>
                  )}
                  {orders.map((order) => (
                    <div className="border py-6 pl-8 flex gap-8 items-start hover:shadow-md transition-all cursor-pointer font-mono">
                      <div className="">
                        <h3 className="text-sm">Order ID</h3>
                        <div className="text-lg font-semibold">
                          {order.ORDER_ID}
                        </div>
                      </div>
                      <div className="">
                        <h3 className="text-sm">Order Priority</h3>
                        <div className="text-lg font-semibold">
                          {order.ORDER_PRIORITY}
                        </div>
                      </div>
                      <div className="">
                        <h3 className="text-sm">Order Status</h3>
                        <div className="text-lg font-semibold">
                          {order.ORDER_STATUS}
                        </div>
                      </div>
                      <div className="">
                        <h3 className="text-sm">Order Date</h3>
                        <div className="text-sm font-semibold flex flex-col">
                          {new Date(order.ORDER_DATE).toLocaleString()}
                        </div>
                      </div>

                      <div className="">
                        <h3 className="text-sm">Payment Status</h3>
                        <div className="text-lg font-semibold">
                          {order.PAYMENT_STATUS}
                        </div>
                      </div>

                      <div className="flex gap-4 self-center">
                        <div className="">
                          <a
                            download={`order_${order.ORDER_ID}.pdf`}
                            href={orderDocuments[order.ORDER_ID]}
                            className="flex items-center gap-2 text-green-600"
                          >
                            <DocumentArrowDownIcon className="h-8 w-8" />
                            {/* <span className="">Download</span> */}
                          </a>
                        </div>
                        <div className="">
                          <div
                            onClick={() => {
                              setShowModal((prev) => !prev);
                              setSelectedOrder(order);
                            }}
                            className="flex items-center gap-2 border-2 rounded-full border-blue-200  w-10 h-10  justify-center  text-blue-600"
                          >
                            <PencilIcon className="h-6 w-6" />
                            {/* <span className="">Download</span> */}
                          </div>
                        </div>
                        <div className="">
                          <div
                            onClick={() => handleDelete(order.ORDER_ID)}
                            className="flex items-center gap-2 border-2 rounded-full border-red-200  w-10 h-10  justify-center  text-red-600"
                          >
                            <TrashIcon className="h-6 w-6" />
                            {/* <span className="">Download</span> */}
                          </div>
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
