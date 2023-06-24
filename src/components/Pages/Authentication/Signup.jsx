import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const customer = { name, phone, email, password };
    console.log(customer);

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/signup/customer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customer),
        }
      );

      const result = await response.json();
      console.log("Success:", result);

      if (result.userCreated) {
        localStorage.clear();
        localStorage.setItem("CUST_ID", result.CUST_ID);

        // User created successfully, navigate to other page
        toast("User registration successfully!", {
          autoClose: 3000,
          type: "success",
          theme: "colored",
          onClose: () => {
            navigate("/search");
          },
        });
      } else {
        // User creation failed, show error toast notification
        toast("Failed to create user.", {
          autoClose: 3000,
          type: "error",
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while signing up.", {
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="bg-slate-100 pt-20">
      <div class="flex flex-col md:flex-row items-start justify-center gap-4 md:gap-24 px-6 pt-6  mx-auto md:h-screen md:-mt-14 pt:mt-0 dark:bg-gray-900 max-w-screen-xl">
        <div className="w-full">
          <img src="/images/authentication/login-illustration.png" alt="" />
        </div>
        <div class="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg dark:bg-gray-800">
          <div className="flex gap-6">
            <h2 className="text-2xl font-bold text-gray-300 dark:text-white">
              <Link to="/login">Login</Link>
            </h2>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              <Link to="/sign-up">Sign Up</Link>
            </h2>
          </div>
          <form onSubmit={handleSignUp} class="mt-8 space-y-6">
            <div className="flex justify-between">
              <div>
                <label
                  for="name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  name="name"
                  id="name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Md John"
                  required
                />
              </div>
              <div>
                <label
                  for="phone-number"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone number
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="text"
                  name="phone-number"
                  id="phone-number"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="+8801712345678"
                  required
                />
              </div>
            </div>
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="name@email.com"
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label
                for="confirm-password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm password
              </label>
              <input
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                type="password"
                name="confirm-password"
                id="confirm-password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
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
                  I accept the{" "}
                  <a
                    href="#"
                    class="text-primary-700 hover:underline dark:text-primary-500"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>
            <button
              type="submit"
              class="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Create account
            </button>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <a
                href="#"
                class="text-primary-700 hover:underline dark:text-primary-500"
              >
                Login here
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
