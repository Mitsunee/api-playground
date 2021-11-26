import nodeFetch from "node-fetch";

export async function fetch(url) {
  try {
    const res = await nodeFetch(url);
    if (!res.ok) return false;
    return res;
  } catch {
    return false;
  }
}

export async function fetchJson(url) {
  try {
    const resContent = await fetch(url);
    if (!resContent) return false;
    return await resContent.json();
  } catch (e) {
    return false;
  }
}
