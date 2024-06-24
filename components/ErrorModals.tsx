"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ErrorModals() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [errorMessage, setErrorMessage] = useState("");
  const [notif, setNotif] = useState(false);

  useEffect(() => {
    if (error) {
      setNotif(true);
      switch (error) {
        case "AccessDenied":
          setErrorMessage(
            "Access Denied. Please make sure you are registered before trying to sign in."
          );
          break;
        case "CredentialsSignin":
          setErrorMessage(
            "Sign in failed. Please check your credentials and try again."
          );
          break;
        // Add more cases as needed for different errors
        default:
          setErrorMessage("An unknown error occurred. Please try again.");
      }
    }
  }, [error]);

  return (
    <>
      <div
        role="alert"
        className={`${
          notif ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-opacity duration-500 ease-in-out`}
      >
        <div
          className={`flex flex-row justify-between bg-red-500 text-white font-bold rounded-t px-4 py-2 relative`}
        >
          <div>{error}</div>
          <span
            className="absolute top-0 bottom-0 right-0 px-2 py-2 hover:cursor-pointer"
            onClick={() => setNotif(false)}
          >
            <svg
              className="fill-current h-6 w-6 text-white-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>

        <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
          <p>{errorMessage}</p>
        </div>
      </div>
    </>
  );
}
