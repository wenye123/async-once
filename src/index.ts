import EventEmitter from "events";

export class AsyncOnceError extends Error {
  name: string = "AsyncOnceError";
  code: string = "TIMEOUT";
  message: string = "超时";
}

export interface IAsyncOnceOptions {
  /** 超时时间，默认5秒 */
  timeout?: number;
}

export default class AsyncOnce {
  private timeout: number;
  private event: EventEmitter;

  constructor(opt: IAsyncOnceOptions) {
    this.timeout = opt.timeout || 5000;
    this.event = new EventEmitter();
    this.event.setMaxListeners(Infinity);
  }

  once<T>(tag: string, fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 添加事件监听器
      this.event.on(tag, (err: any, ret: T) => {
        this.event.removeAllListeners(tag); // 清除事件监听防止内存溢出
        if (err) return reject(err);
        resolve(ret);
      });
      // 首个请求
      if (this.event.listenerCount(tag) === 1) {
        // 超时处理
        const tid = setTimeout(() => {
          if (this.event.eventNames().includes(tag)) {
            this.event.emit(tag, new AsyncOnceError());
          }
        }, this.timeout);
        // 执行函数
        fn()
          .then(ret => {
            this.event.emit(tag, null, ret);
          })
          .catch(err => {
            this.event.emit(tag, err);
          })
          .finally(() => {
            clearTimeout(tid);
          });
      }
    });
  }
}
