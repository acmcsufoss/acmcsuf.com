import { afterEach, expect, test, vi } from 'vitest';
import { shortener } from './shortener';

afterEach(() => vi.unstubAllGlobals());

test('redirects when the shortlink service resolves the path', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(null, {
        status: 302,
        headers: { location: 'https://example.com/docs?source=shortlink' },
      })
    )
  );
  const resolve = vi.fn();

  const response = await shortener()({
    event: { request: new Request('https://acmcsuf.com/general/workshop?source=request&foo=bar') },
    resolve,
  } as never);

  expect(response.headers.get('location')).toBe('https://example.com/docs?source=request&foo=bar');
  expect(response.status).toBe(302);
  expect(resolve).not.toHaveBeenCalled();
  const [requestedURL, options] = vi.mocked(fetch).mock.calls[0];
  expect(requestedURL.toString()).toBe('https://s.acmcsuf.com/general/workshop?source=request&foo=bar');
  expect(options).toEqual({ redirect: 'manual' });
});

test('falls through to the application when the path is not a shortlink', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Not found', { status: 404 })));
  const resolved = new Response('Site page');
  const resolve = vi.fn().mockResolvedValue(resolved);

  const response = await shortener()({
    event: { request: new Request('https://acmcsuf.com/events') },
    resolve,
  } as never);

  expect(response).toBe(resolved);
  expect(resolve).toHaveBeenCalledOnce();
});
