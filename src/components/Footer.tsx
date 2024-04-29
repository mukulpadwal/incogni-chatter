import React from "react";


const Footer = () => {
  return (
    <footer className="border border-x-0 border-b-0 p-4">
      <p className="text-center font-semibold">
        {new Date().getFullYear()} &copy;Incogni Chatter | All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
