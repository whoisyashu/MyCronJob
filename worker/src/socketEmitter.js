import fetch from "node-fetch";

export async function emitEventToBackend({ userId, event, payload }) {
  await fetch("http://localhost:3000/internal/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-secret": process.env.INTERNAL_SECRET
    },
    body: JSON.stringify({
      userId,
      event,
      payload
    })
  });
}
