import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "http://localhost:8081"; // Update if your API runs on a different port

export const options = {
  stages: [
    { duration: "30s", target: 25 }, // ramp-up to 25 users
    { duration: "30s", target: 50 }, // ramp-up to 50 users
    { duration: "30s", target: 75 }, // ramp-up to 75 users
    { duration: "30s", target: 100 }, // ramp-up to 100 users
    { duration: "30s", target: 125 }, // ramp-up to 125 users
    { duration: "30s", target: 150 }, // ramp-up to 150 users
    { duration: "30s", target: 0 }, // ramp-down to 0 users
  ],
  ext: {
    loadimpact: {
      name: "Venue GET Breakpoint Test",
    },
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/venues`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("Response body:", res.body); // Debug log

  check(res, {
    "status is 200": (r) => r.status === 200,
    "has data array": (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return Array.isArray(body.data); // Adjust according to actual API response
      } catch (err) {
        console.error("JSON parse failed:", err.message);
        return false;
      }
    },
  });

  sleep(1);
}
