# async-once

多个异步函数只执行一次

## 安装

```bash
npm i -S @wenye123/async-once
```

## 使用例子

```javascript
import AsyncOnce from "@wenye123/async-once";

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
```
