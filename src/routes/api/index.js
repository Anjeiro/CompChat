// This file must exist in the repo before build for Vercel to recognize it
export default async function handler(req, res) {
  const { default: serverHandler } = await import("../dist/server/server.js");
  return serverHandler(req, res);
}
