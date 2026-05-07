import { join } from "path";
import { pathToFileURL } from "url";
import { createRequire } from "module";

const __dirname = new URL(".", import.meta.url).pathname;

export default async function handler(req, res) {
  const serverPath = pathToFileURL(join(__dirname, "../dist/server/server.js")).href;
  const { default: serverHandler } = await import(serverPath);
  return serverHandler(req, res);
}
