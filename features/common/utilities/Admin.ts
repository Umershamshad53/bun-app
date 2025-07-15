import { config } from "dotenv";





config();

const registerAdmin = async () => {
  try {
    const payload = {
      name: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: process.env.ADMIN_ROLE,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/signUp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    await response.json();
  } catch  {
    console.error("❌ Admin creation error:");
  }
};

export default registerAdmin;