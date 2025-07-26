import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "10s", target: 100 },
    { duration: "20s", target: 100 },
    { duration: "10s", target: 10 },
    { duration: "10s", target: 0 },
  ],
  ext: {
    loadimpact: {
      name: "Event GET Spike Test",
    },
  },
};

export default function () {
  const res = http.get("http://localhost:8081/events", {
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': `Bearer YOUR_VALID_TOKEN`,
    },
  });

  // Optional: Debugging line
  // console.log(res.body);

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
