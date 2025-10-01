import { useEffect } from "react";

function useLogger(message: string, deps: any[] = []) {
  useEffect(() => {
    console.log("useLogger:", message);
  }, deps); // Re-run effect when deps change
}

export default useLogger;
