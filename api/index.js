export default async function handler(req, res) {
  const { default: serverHandler } = await import("../dist/server/server.js");
  return serverHandler(req, res);
}
