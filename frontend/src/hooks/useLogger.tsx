import { useEffect } from "react";

function useLogger(message: string, deps: unknown[] = []) {
  useEffect(() => {
    console.log("useLogger:", message);
  }, deps); // Re-run effect when deps change
}

export default useLogger;
