import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();

    const handleLogin = async (e) => {
      e.preventDefault();

      const email = e.target.email.value;
      const password = e.target.password.value;

      const user = { email, password };

      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/login/customer",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          }
        );

        if (response.ok) {
          const result = await response.json();
          toast(`Welcome ${result.CUST_NAME}!!!`, {
            type: "success",
            theme: "colored",
          });
          localStorage.clear();
          localStorage.setItem("CUST_ID", result.CUST_ID);
          navigate("/search");
        } else {
          const errorData = await response.json();
          console.error("Error:", errorData.error);
          // Display an error message to the user, e.g., using a toast notification library
          toast(`Error: ${errorData.error}`, {
            type: "error",
            theme: "colored",
          });
        }
      } catch (error) {
        toast(`Error: ${error}`, {
          type: "error",
          theme: "colored",
        });
      }
    };

  return (
    <div className="bg-slate-100 pt-20">
      <div class=" flex flex-col md:flex-row items-start justify-center gap-4 md:gap-24 px-6 pt-6  mx-auto md:h-screen md:-mt-14 pt:mt-0 dark:bg-gray-900 max-w-screen-xl">
        <div className="w-full">
          <img src="/images/authentication/login-illustration.png" alt="" />
        </div>             
        <div class="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="flex gap-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              <Link to="/login">Login</Link>
            </h2>
            <h2 className="text-2xl font-bold text-gray-300 dark:text-white">
              <Link to="/sign-up">Sign Up</Link>
            </h2>
          </div>
          <form onSubmit={handleLogin} class="mt-8 space-y-6" action="#">
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="name@company.com"
                required=""
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required=""
              />
            </div>
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  aria-describedby="remember"
                  name="remember"
                  type="checkbox"
                  class="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                  required=""
                />
              </div>
              <div class="ml-3 text-sm">
                <label
                  for="remember"
                  class="font-medium text-gray-900 dark:text-white"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                class="ml-auto text-sm text-primary-700 hover:underline dark:text-primary-500"
              >
                Lost Password?
              </a>
            </div>
            <button
              type="submit"
              class="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Login to your account
            </button>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Not registered?{" "}
              <a class="text-primary-700 hover:underline dark:text-primary-500">
                Create account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
