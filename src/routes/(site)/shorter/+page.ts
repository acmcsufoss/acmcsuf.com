interface Link {
  slug: string;
  url: string;
  isPermanent: boolean;
  createdAt: string;
  updatedAt: string;
}
interface ServiceResponse {
  success: boolean;
  result: Link[];
}

export async function load({ fetch }) {
  const resp = await fetch('https://s.acmcsuf.com');
  const data = await resp.json() as ServiceResponse;
  return { links: data.result };
}
