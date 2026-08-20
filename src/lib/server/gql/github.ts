import { GH_ACCESS_TOKEN } from '$lib/server/env';

const GRAPHQL_URL = 'https://api.github.com/graphql';

export async function doQuery<T>(query: string): Promise<T> {
  if (!GH_ACCESS_TOKEN) {
    throw new Error('GitHub query failed: GH_ACCESS_TOKEN is not set');
  }

  const r = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { Authorization: `token ${GH_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!r.ok) {
    throw new Error(`GitHub query failed: ${r.status} ${r.statusText}`);
  }

  const body = await r.json();

  if (!body) {
    throw new Error(`GitHub query failed: no body returned`);
  }

  // A failed query responds with an errors array we handle.
  if (body.errors && body.errors.length > 0) {
    const reason = body.errors?.map((e: { message: string }) => e.message).join('; ');
    throw new Error(`GitHub query failed: ${reason}`);
  }

  return body.data as T;
}
