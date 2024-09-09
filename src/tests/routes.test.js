describe("Testing routes", () => {
  test("GET / should return 200", async () => {
    const res = await fetch("http://localhost:3000");
    expect(res.status).toBe(200);
  });

  test("GET /login should return 200", async () => {
    const res = await fetch("http://localhost:3000/login");
    expect(res.status).toBe(200);
  });
});

describe("Testing redirects", () => {
  test("GET /entrar should redirect to /login", async () => {
    const res = await fetch("http://localhost:3000/entrar");
    expect(res.redirected).toBe(true);
    expect(res.url).toBe("http://localhost:3000/login");
  });
});
