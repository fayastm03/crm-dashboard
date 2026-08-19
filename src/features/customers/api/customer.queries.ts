import { useQuery } from "@tanstack/react-query";
import { fetchCustomers } from "./mock-api";
import { FetchCustomersParams } from "../types/customer.types";

export function useCustomers(params: FetchCustomersParams) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => fetchCustomers(params),
    placeholderData: (previousData) => previousData, // keeps old rows visible while refetching, avoids table flicker
  });
}