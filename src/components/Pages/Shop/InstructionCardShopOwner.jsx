import React from "react";

export default function InstructionCardShopOwner() {
  return (
    <div className="shadow-xl p-8 rounded-xl">
      <h2 className="text-2xl font-bold mb-5">Instruction and measure</h2>
      <ol className="list-decimal ml-4">
        <li>Add your shop details</li>
        <li>Select services you want to offer</li>
        <li>Upload your document</li>
        <li>Select paper size</li>
        <li>Select color or black and white</li>
        <li>Select range</li>
      </ol>
      <div className="mt-6 rounded-xl overflow-hidden">
        <iframe
          width="100%"
          height="180"
          src="https://www.youtube.com/embed/2YM_nyW2rDM"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  );
}
