import { expect, test } from "bun:test";
import { $ } from "bun";

test("Tsgrep finds 'attempt' in testdir and prints file locations", async () => {
  const rawOutput = await $`bun run main.ts search testdir attempt`.text();
  const output = Bun.stripANSI(rawOutput).replaceAll("\\", "/");

  expect(output).toContain("testdir/diristesting/third/app.logs:7:45");

  expect(output).toContain("[2026-11-19 08:31:15] ERROR: Failed payment attempt for Order #ORD-99813. Reason: INSUFFICIENT_FUNDS (Code: ERR_402");
});

test("Tsgrep handles words that do not exist", async () => {
  const result = await $`bun run main.ts search testdir nonexistentword123`.nothrow();
  const output = result.text();

  expect(output).not.toContain("Found at file:");
});


test("Tsgrep lists all directory in testdir and prints out tree", async()=>{
    const rawOutput = await $`bun run main.ts read testdir`.text();
    const output = Bun.stripANSI(rawOutput).replaceAll("\\","/");

    // Verify top-level and nested files appear
    expect(output).toContain("- demo.js");
    expect(output).toContain("- iamarat.txt");
    expect(output).toContain("- wow.c");
    expect(output).toContain("- twosecond.c");
    expect(output).toContain("- app.logs");

    // Verify nested directory paths appear
    expect(output).toContain("- testdir/diristesting");
    expect(output).toContain("- testdir/diristesting/second/secondtwo");
    expect(output).toContain("- testdir/diristesting/third");
})


