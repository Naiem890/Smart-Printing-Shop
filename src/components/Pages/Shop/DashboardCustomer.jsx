import { QueueListIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function DashboardCustomer() {
  return (
    <div>
      <aside
        id="default-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul>
            <li className="mb-20">
              <Link to="/" class="flex items-center">
                <span class="ml-2 self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                  PrintEase
                </span>
              </Link>
            </li>
            <li>
              <Link
                to=""
                class="flex my-2 items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span class="ml-3">Order List</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <div class="p-2 sm:ml-64">
        <Outlet />
      </div>
    </div>
  );
}
