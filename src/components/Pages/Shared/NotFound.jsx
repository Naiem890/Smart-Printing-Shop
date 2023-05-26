import React from "react";

export default function NotFound() {
  return (
    <section class="bg-white dark:bg-gray-900 -mt-8">
      <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div class="mx-auto max-w-screen-sm text-center">
          <img
            class="mx-auto max-w-sm"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/404/404-computer.svg"
            alt="404 Not Found"
          />
          <h1 class="mb-4 text-2xl tracking-tight font-extrabold  text-primary-600 dark:text-primary-500">
            404 Not Found
          </h1>
          <p class="mb-4 text-5xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
            Whoops! That page doesn’t exist.
          </p>
          <p class="mb-4 font-light text-gray-500 dark:text-gray-400">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.
          </p>
          <a
            href="#"
            class="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
          >
            Back to Homepage
          </a>
        </div>
      </div>
    </section>
  );
}
