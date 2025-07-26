import http from "k6/http";
import { check, sleep } from "k6";

// Update if your API runs on a different port

export const options = {
  stages: [
    { duration: "30s", target: 20 }, // ramp-up to 20 users
    { duration: "30s", target: 100 }, // ramp-up to 100 users
    { duration: "30s", target: 200 }, // ramp-up to 200 users
    { duration: "1m", target: 300 }, // spike to 300 users
    { duration: "30s", target: 0 }, // ramp-down to 0 users
  ],
  ext: {
    loadimpact: {
      name: "event GET Stress Test",
    },
  },
};

export default function () {
  const res = http.get(`http://localhost:8081/events`, {
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': `Bearer YOUR_VALID_TOKEN`,
    },
  });

  check(res, {
    "status is 200": (r) => r.status === 200,
    "has data array": (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return Array.isArray(body.data);
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
