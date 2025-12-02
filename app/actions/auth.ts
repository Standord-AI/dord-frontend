"use server";

import {
  SignupPayload,
  AuthResponse,
  UserRole,
  LoginPayload,
  MerchantSignupPayload,
} from "@/global-types";

import { cookies } from "next/headers";

export async function loginUser(
  prevState: any,
  formData: FormData
): Promise<AuthResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      success: false,
      error: "Email and password are required",
    };
  }

  const payload: LoginPayload = {
    Email: email,
    Password: password,
  };

  try {
    const response = await fetch(`${process.env.AUTH_SERVICE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Invalid email or password",
      };
    }

    // Set the cookie
    if (data.token) {
      (await cookies()).set("Authorization", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        sameSite: "lax",
      });
    }

    // Decode token to get tenant_id
    let tenantId = "";
    try {
      const base64Url = data.token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const payload = JSON.parse(jsonPayload);
      tenantId = payload.tenant_id;
    } catch (e) {
      console.error("Failed to decode token for tenant_id", e);
    }

    return {
      success: true,
      message: "Login successful",
      data: { ...data.user, TenantID: tenantId },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

import { sendMerchantRequestEmail } from "@/lib/nodemailer";

export async function requestMerchantAccount(
  prevState: any,
  formData: FormData
): Promise<AuthResponse> {
  const name = formData.get("name") as string;
  const businessEmail = formData.get("businessEmail") as string;
  const businessPhone = formData.get("businessPhone") as string;
  const description = formData.get("description") as string;

  if (!name || !businessEmail) {
    return {
      success: false,
      error: "Business Name and Email are required",
    };
  }

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Get token to extract ownerId
  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization")?.value;

  if (!token) {
    return {
      success: false,
      error: "You must be logged in to request a merchant account",
    };
  }

  // Simple JWT decode to get user details
  let ownerId = "";
  let contactName = "Unknown";
  let contactEmail = "Unknown";
  let contactPhone = "Unknown";

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    const payload = JSON.parse(jsonPayload);

    ownerId = payload.sub;
    contactName = `${payload.first_name} ${payload.last_name}`;
    contactEmail = payload.email;
    contactPhone = payload.phone;
  } catch (e) {
    console.error("Failed to decode token", e);
    return {
      success: false,
      error: "Invalid authentication token",
    };
  }

  const payload: MerchantSignupPayload = {
    name,
    slug,
    ownerId,
    businessEmail,
    businessPhone,
    description,
    contactName,
    contactEmail,
    contactPhone,
  };

  try {
    await sendMerchantRequestEmail(payload);

    return {
      success: true,
      message:
        "Your request has been sent to support. We will contact you shortly.",
    };
  } catch (error) {
    console.error("Request merchant account error:", error);
    return {
      success: false,
      error: "Failed to send request. Please try again later.",
    };
  }
}

export async function signupUser(
  prevState: any,
  formData: FormData
): Promise<AuthResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as UserRole;

  // Basic validation
  if (!email || !password || !firstName || !lastName || !phone || !role) {
    return {
      success: false,
      error: "All fields are required",
    };
  }

  const payload: SignupPayload = {
    Email: email,
    Password: password,
    FirstName: firstName,
    LastName: lastName,
    Phone: phone,
    Role: role,
  };

  try {
    const response = await fetch(`${process.env.AUTH_SERVICE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to create account",
      };
    }

    return {
      success: true,
      message: "Account created successfully",
      data: data.user,
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

export async function logoutUser(): Promise<AuthResponse> {
  (await cookies()).delete("Authorization");
  return {
    success: true,
    message: "Logged out successfully",
  };
}
