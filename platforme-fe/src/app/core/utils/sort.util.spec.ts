import { sortItems } from "./sort.util";

interface Item {
  name: string;
  score: number;
}

describe("sortItems", () => {
  const items: Item[] = [
    { name: "Charlie", score: 10 },
    { name: "Alice", score: 30 },
    { name: "Bob", score: 20 },
  ];

  const accessors = {
    name: (item: Item) => item.name,
    score: (item: Item) => item.score,
  };

  it("sorts strings ascending", () => {
    const sorted = sortItems(items, "name", "asc", accessors, "name");
    expect(sorted.map((item) => item.name)).toEqual([
      "Alice",
      "Bob",
      "Charlie",
    ]);
  });

  it("sorts numbers descending", () => {
    const sorted = sortItems(items, "score", "desc", accessors, "score");
    expect(sorted.map((item) => item.score)).toEqual([30, 20, 10]);
  });

  it("uses fallback when direction is empty", () => {
    const sorted = sortItems(items, "", "", accessors, "name", "asc");
    expect(sorted[0].name).toBe("Alice");
  });
});
