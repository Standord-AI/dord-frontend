"use server";

import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/utils"; // Assuming decodeJwt is in lib/utils based on other files
import { GetCustomersResponse, CustomerStats, Customer } from "@/global-types";

export async function getCustomers(page: number = 1, limit: number = 20) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("Authorization");
  const token = authCookie?.value;

  if (!token) {
    return { success: false, error: "No authorization token found" };
  }

  const decoded = decodeJwt(token);
  const tenantId = decoded?.tenant_id;

  if (!tenantId) {
    return { success: false, error: "Invalid token: missing tenant_id" };
  }

  try {
    const res = await fetch(
      `${process.env.PRODUCTS_SERVICE_URL}/api/v1/customers?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Tenant-ID": tenantId,
          Cookie: `Authorization=${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to fetch customers",
      };
    }

    return { success: true, data: data as GetCustomersResponse };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getCustomerStats() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("Authorization");
  const token = authCookie?.value;

  if (!token) {
    return { success: false, error: "No authorization token found" };
  }

  const decoded = decodeJwt(token);
  const tenantId = decoded?.tenant_id;

  if (!tenantId) {
    return { success: false, error: "Invalid token: missing tenant_id" };
  }

  try {
    const res = await fetch(
      `${process.env.PRODUCTS_SERVICE_URL}/api/v1/customers/stats/summary`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Tenant-ID": tenantId,
          Cookie: `Authorization=${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to fetch customer stats",
      };
    }

    return { success: true, data: data.stats as CustomerStats };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getCustomerById(id: number) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("Authorization");
  const token = authCookie?.value;

  if (!token) {
    return { success: false, error: "No authorization token found" };
  }

  const decoded = decodeJwt(token);
  const tenantId = decoded?.tenant_id;

  if (!tenantId) {
    return { success: false, error: "Invalid token: missing tenant_id" };
  }

  try {
    const res = await fetch(
      `${process.env.PRODUCTS_SERVICE_URL}/api/v1/customers/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Tenant-ID": tenantId,
          Cookie: `Authorization=${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to fetch customer",
      };
    }

    return { success: true, data: data.customer as Customer };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" };
  }
}
