import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "http://localhost:8081"; // Adjust if needed

export const options = {
  stages: [
    { duration: "30s", target: 40 }, // ramp-up to 40 users over 30 seconds
    { duration: "40s", target: 50 }, // stay at 50 users for 40 seconds
    { duration: "10s", target: 0 }, // ramp-down to 0 users
  ],
  ext: {
    loadimpact: {
      name: "Events GET Load Test",
    },
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/events`, {
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': `Bearer ${token}`,
    },
  });

  check(res, {
    "status is 200": (r) => r.status === 200,
    "has data array": (r) => {
      try {
        const body = JSON.parse(r.body as string);
        // console.log(r.body); // Uncomment if you want to debug
        return Array.isArray(body.data) && body.data.length > 0;
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
