// Function to encode data in Base64 URL format
function base64UrlEncode(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Function to decode Base64 URL format
function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "="; // Ensure padding
  return atob(base64);
}

// Function to generate a mock JWT (normally done on the backend)
function generateJWT(payload, expiresIn = "1m") {
  const header = { alg: "HS256", typ: "JWT" };
  const expTime = Date.now() + 60000; // 1-minute expiry

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify({ ...payload, exp: expTime }));

  // Simulated signature using Base64 encoding
  const signature = base64UrlEncode("mock-signature");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Function to store JWT in localStorage
function storeToken(token) {
  localStorage.setItem("jwtToken", token);
  console.log("✅ Token stored!");
}

// Function to retrieve and check if the token is expired
function getToken() {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    console.error("❌ No token found!");
    return "No token found!";
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    console.error("❌ Invalid JWT format!");
    removeToken();
    return "Invalid token!";
  }

  try {
    const decodedPayload = JSON.parse(base64UrlDecode(parts[1]));

    if (Date.now() > decodedPayload.exp) {
      console.warn("⚠️ Token expired, removing...");
      removeToken();
      return "Token expired!";
    }

    return token;
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    removeToken();
    return "Error decoding token!";
  }
}

// Function to remove token (logout)
function removeToken() {
  localStorage.removeItem("jwtToken");
  console.log("🚀 Token removed!");
}

// Display token on index.html only
window.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname === "/index.html" || window.location.pathname === "/") {
    const tokenDisplay = document.createElement("p");
    tokenDisplay.textContent = `Stored Token: ${getToken()}`;
    document.body.appendChild(tokenDisplay);
  }
});

// Generate and store a token if none exists
if (!localStorage.getItem("jwtToken")) {
  const token = generateJWT({ user: "exampleUser" }, "1m");
  storeToken(token);
}
