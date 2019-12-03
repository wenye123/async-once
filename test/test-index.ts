import AsyncOnce, { AsyncOnceError } from "../src/index";
import { assert } from "chai";

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

describe("AsyncOnce", function() {
  it("获取数据", async function() {
    const aonce = new AsyncOnce({ timeout: 1000 });
    const ret1 = await aonce.once("a", async () => {
      await sleep(50);
      return "wenye";
    });
    assert.strictEqual(ret1, "wenye");
    const ret2 = await aonce.once("a", async () => {
      await sleep(50);
      return "yiye";
    });
    assert.strictEqual(ret2, "yiye");
  });

  it("并发获取数据", async function() {
    const aonce = new AsyncOnce({ timeout: 1000 });
    const tag = "test";
    let counter = 0;
    async function getData() {
      counter++;
      await sleep(50);
      return "wenye";
    }
    const ret = await Promise.all([
      aonce.once(tag, getData),
      aonce.once(tag, getData),
      aonce.once(tag, getData),
      aonce.once(tag, getData),
      aonce.once(tag, getData),
      aonce.once(tag, getData),
      aonce.once(tag, getData),
      aonce.once(tag, getData),
      aonce.once(tag, getData),
      aonce.once(tag, getData),
      aonce.once(tag, getData),
    ]);
    assert.strictEqual(counter, 1);
    assert.deepStrictEqual(ret, [
      "wenye",
      "wenye",
      "wenye",
      "wenye",
      "wenye",
      "wenye",
      "wenye",
      "wenye",
      "wenye",
      "wenye",
      "wenye",
    ]);
  });

  it("并发获取数据超时", async function() {
    const aonce = new AsyncOnce({ timeout: 50 });
    const tag = "test";
    let counter = 0;
    async function getData() {
      counter++;
      await sleep(100);
      return "wenye";
    }
    let isThrowError = false;
    try {
      await Promise.all([
        aonce.once(tag, getData),
        aonce.once(tag, getData),
        aonce.once(tag, getData),
        aonce.once(tag, getData),
        aonce.once(tag, getData),
      ]);
    } catch (err) {
      isThrowError = true;
      assert.instanceOf(err, AsyncOnceError);
    }
    assert.strictEqual(isThrowError, true);
    assert.strictEqual(counter, 1);
  });

  it("并发获取数据报错", async function() {
    const aonce = new AsyncOnce({ timeout: 1000 });
    const tag = "test";
    let counter = 0;
    async function getData() {
      counter++;
      await sleep(50);
      throw new Error("test err");
    }
    let isThrowError = false;
    try {
      await Promise.all([
        aonce.once(tag, getData),
        aonce.once(tag, getData),
        aonce.once(tag, getData),
        aonce.once(tag, getData),
        aonce.once(tag, getData),
      ]);
    } catch (err) {
      isThrowError = true;
      assert.strictEqual(err.message, "test err");
    }
    assert.strictEqual(isThrowError, true);
    assert.strictEqual(counter, 1);
  });
});
