import React from "react";

export default function Innovation() {
  return (
    <section class="bg-white dark:bg-gray-900">
      <div class="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
        <div class="font-light text-gray-500 sm:text-lg dark:text-gray-400">
          <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Revolutionizing Printing Solutions
          </h2>
          <p>
            We are pioneers in the field of printing technology, bringing
            together strategists, designers, and developers. Our team consists
            of innovative problem solvers who understand the value of simplicity
            and efficiency. While we are nimble enough to deliver swift results,
            we are also equipped to handle projects of any scale, ensuring that
            we meet your requirements at your desired pace. With our expertise
            in printing solutions, we provide a seamless experience that is both
            simple and effective.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-4 mt-8">
          <img
            class="w-full rounded-lg"
            src="/images/women-printing.png"
            alt="office content 1"
          />
          <img
            class="mt-4 w-full lg:mt-10 rounded-lg"
            src="/images/women-printing-2.png"
            alt="office content 2"
          />
        </div>
      </div>
    </section>
  );
}
