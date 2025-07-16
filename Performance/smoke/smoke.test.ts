import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 1, // 1 virtual user
  iterations: 1, // 1 iterations
  duration: "10s", // 15 seconds duration
};

export default function () {
  const url = "http://localhost:8081/auth/login";
  const payload = JSON.stringify({
    email: "brysongathuku189@gmail.com",
    password: "bryson",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response has token": (r) => {
      try {
        const body = JSON.parse(r.body as string);
        console.log("my token 1");
        console.log("my token", body);

        return typeof body.token === "string";
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
