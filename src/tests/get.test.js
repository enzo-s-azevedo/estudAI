test("teste", async () => {
  expect(
    await fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => json.id)
  ).toBe(1);
});
