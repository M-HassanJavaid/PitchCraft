// src/components/StartupCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const StartupCard = ({ name, tagline, id }) => {
  return (
    <div className="bg-black shadow-xl rounded-2xl h-full p-5 max-w-sm w-full text-center border-4 border-white hover:shadow-xl transition-all duration-300 shadow-amber-500">
      <h2 className="text-2xl font-semibold text-white my-2.5">{name}</h2>
      <p className="text-white my-2.5">{tagline}</p>
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
