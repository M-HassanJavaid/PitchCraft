// src/components/StartupCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const StartupCard = ({ name, tagline, id }) => {
  return (
    <div className="bg-black shadow-lg rounded-2xl h-full p-5 w-full border-4 border-white transition-all duration-300 shadow-amber-500 flex justify-between items-center">
      <div>
        <h2 className="text-2xl text-white my-2.5 font-bold">{name}</h2>
        <p className="text-white my-2.5 text-xl">{tagline}</p>

      </div>
      <Link to={`/startup/${id}`}>
        <button
          className="my-2.5 cursor-pointer bg-amber-400 text-black py-2 px-5 rounded-full border-2 hover:border-amber-500 hover:bg-black hover:text-white transition-colors"
        >
          View More
        </button>
      </Link>
    </div>
  );
};

export default StartupCard;
