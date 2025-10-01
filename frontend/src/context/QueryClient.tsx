"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {" "}
      {/* <ReactQueryDevtools initialIsOpen={false} position="top" /> */}
      {children}
    </QueryClientProvider>
  );
};

export default ClientProvider;
