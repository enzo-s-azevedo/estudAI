describe("Verificar se o site está rodando", () => {
  test("GET / should return 200", async () => {
    const res = await fetch("http://localhost:3000");
    expect(res.status).toBe(200);
  });
});
