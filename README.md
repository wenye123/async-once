# async-once

[![Build Status](https://travis-ci.org/wenye123/async-once.svg?branch=master)](https://travis-ci.org/wenye123/async-once)
[![Coverage Status](https://coveralls.io/repos/github/wenye123/async-once/badge.svg)](https://coveralls.io/github/wenye123/async-once)
[![npm](https://img.shields.io/npm/v/@wenye123/async-once)](https://www.npmjs.com/package/@wenye123/async-once)
[![npm](https://img.shields.io/npm/dw/@wenye123/async-once)](https://www.npmjs.com/package/@wenye123/async-once)

多个异步函数只执行一次

## 安装


```bash
npm i -S @wenye123/async-once
```

## 使用例子

```javascript
import AsyncOnce from "@wenye123/async-once";

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

(async function() {
  const aonce = new AsyncOnce({ timeout: 3000 });

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
  ]);

  console.debug(counter); // 1
  console.debug(ret); // ["wenye", "wenye", "wenye", "wenye"]
})();

```
