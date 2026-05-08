const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const cron = require("node-cron");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);

    cron.schedule("*/30 * * * *", async () => {
      console.log(`[${new Date().toISOString()}] Running scheduled poll...`);
      try {
        const res = await fetch(`http://${hostname}:${port}/api/poll`, {
          method: "POST",
        });
        const data = await res.json();
        console.log(
          `[${new Date().toISOString()}] Poll complete: ${data.newActivities} new activities (${data.status})`
        );
      } catch (err) {
        console.error(`[${new Date().toISOString()}] Poll failed:`, err.message);
      }
    });

    console.log("> Background polling scheduled every 30 minutes");
  });
});
