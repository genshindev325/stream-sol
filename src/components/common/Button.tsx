import React from "react";

type Props = {
  handleClick: () => void;
  text: string;
  primary?: boolean;
};

export default function Button({ handleClick, text, primary = false }: Props) {
  return (
    <div
      className={`flex justify-center items-center w-[120px] lg:w-[160px] h-[40px] lg:h-[48px] text-[0.875rem] sm:text-[1.125rem] hover:cursor-pointer rounded-lg ${
        primary ? "bg-primary-300" : "border border-1 border-grey-800"
      }`}
      onClick={handleClick}
    >
      {text}
    </div>
  );
}
