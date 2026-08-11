const API_BASE_URL = "http://localhost:8000/api";

// ============================================================
// Login
// ============================================================
export async function loginUser(credentials) {
    const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(credentials),
        }
    );

    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error("Invalid server response");
    }

    if (!response.ok) {
        throw new Error(
            data?.error || "Login failed"
        );
    }

    return data;
}
