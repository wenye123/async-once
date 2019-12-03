import { getStr } from "../src/index";
import assert from "assert";

describe("test", function() {
  it("hello", function() {
    assert.equal(getStr(), "hello");
  });
});
