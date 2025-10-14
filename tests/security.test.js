const { getCorsOptionsFromEnv, createRateLimiter } = require('../src/config/security');

describe('security config', () => {
  const OLD = process.env.CORS_ALLOWLIST;
  afterEach(() => {
    process.env.CORS_ALLOWLIST = OLD;
    delete process.env.RATE_LIMIT_WINDOW_MS;
    delete process.env.RATE_LIMIT_MAX;
  });

  test('getCorsOptionsFromEnv allows all when env not set', () => {
    delete process.env.CORS_ALLOWLIST;
    const opts = getCorsOptionsFromEnv();
    expect(opts).toBe(true);
  });

  test('getCorsOptionsFromEnv returns origin checker when set', (done) => {
    process.env.CORS_ALLOWLIST = 'https://example.com';
    const opts = getCorsOptionsFromEnv();
    expect(typeof opts.origin).toBe('function');
    // allowed origin
    opts.origin('https://example.com', (err, ok) => {
      expect(err).toBeNull();
      expect(ok).toBe(true);
      // disallowed origin
      opts.origin('https://bad.com', (err2) => {
        expect(err2).toBeInstanceOf(Error);
        done();
      });
    });
  });

  test('createRateLimiter returns a middleware function', () => {
    delete process.env.RATE_LIMIT_WINDOW_MS;
    delete process.env.RATE_LIMIT_MAX;
    const rl = createRateLimiter();
    expect(typeof rl).toBe('function');
  });
});
