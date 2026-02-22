import { getUserToken } from "@/lib/serverUtilis";

export async function UpdateUserProfile(userData: {
  name: string;
  email: string;
  phone: string;
}) {
  try {
    const token = await getUserToken();

    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/users/updateMe/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token as string,
        },
        body: JSON.stringify(userData), // ✅ send user data
      }
    );

    const data = await res.json();
    console.log("Update profile raw data:", data);

    if (res.ok) {
      return {
        data: data,
        success: true,
        message: data.message || "Profile updated successfully",
      };
    }

    return {
      data: data,
      success: false,
      message: data.message || "Failed to update profile",
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      data: null,
      success: false,
      message: "Unexpected error occurred",
    };
  }
}
export async function UpdateUserPassword(userCredeintials: {
  currentPassword: string;
  password: string;
  rePassword: string;
}) {
  try {
    const token = await getUserToken();

    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/users/changeMyPassword`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token as string,
        },
        body: JSON.stringify(userCredeintials), 
      }
    );

    const data = await res.json();
    console.log("Update profile raw data:", data);

    if (res.ok) {
      return {
        data: data,
        success: true,
        message: data.message || "Profile updated successfully",
      };
    }

    return {
      data: data,
      success: false,
      message: data.message || "Failed to update profile",
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      data: null,
      success: false,
      message: "Unexpected error occurred",
    };
  }
}