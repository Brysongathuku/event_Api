import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 10 }, // ramp-up
    { duration: "10s", target: 100 }, // spike
    { duration: "20s", target: 100 }, // sustain load
    { duration: "10s", target: 10 }, // ramp-down
    { duration: "10s", target: 0 }, // end
  ],
  ext: {
    loadimpact: {
      name: "Venue GET Spike Test",
    },
  },
};

export default function () {
  const res = http.get("http://localhost:8081/venues", {
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer YOUR_VALID_TOKEN`, // if needed
    },
  });

  check(res, {
    "status is 200": (r) => r.status === 200,
    "has data array": (r) => {
      try {
        const body = JSON.parse(r.body as string);
        console.log("RESPONSE BODY:", res.body);
        return Array.isArray(body.data); //
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
