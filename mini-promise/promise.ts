type HandleFn = (value?: any) => void;

type PromiseFn = (resolve: HandleFn, reject: HandleFn) => void;

type OnSuccess = (data: any) => any;

type OnFail = (error: any) => any;

type OnFinally = () => void;

enum Status {
  Pending = 1,
  Resolved = 2,
  Rejected = 3,
}

class Promise {
  static resolve = (value?: any): Promise => {
    const p = new Promise().resolve(value);
    return p;
  }

  static reject = (error?: any): Promise => {
    const p = new Promise().reject(error);
    return p;
  }

  private handleChain: [OnSuccess, OnFail, OnFinally?][] = [];
  private value: any;
  private error: any;
  private status: Status = Status.Pending;

  constructor(fn?: PromiseFn) {
    fn && fn(this.resolve.bind(this), this.reject.bind(this));
    return this;
  }

  // TODO: then / catch / finally 返回的 promise 需要重新创建，而非返回原来的 this 对象。因为 promise1.then() !== promise1。
  public then(onSuccess: OnSuccess, onFail?: OnFail): Promise {
    switch (this.status) {
      case Status.Pending:
        this.handleChain.push([onSuccess, onFail]);
        break;
      case Status.Resolved:
        this.resolve(onSuccess(this.value));
        break;
      case Status.Rejected:
        this.resolve(onFail(this.error));
        break;
    }
    
    return this;
  }

  public catch(onFail: OnFail): Promise {
    switch (this.status) {
      case Status.Pending:
        this.handleChain.push([undefined, onFail]);
        break;
      case Status.Rejected:
        this.value = onFail(this.error);
        this.status = Status.Resolved;
        break;
    }
    
    return this;
  }

  public finally(onFinally: OnFinally): Promise {
    switch (this.status) {
      case Status.Pending:
        this.handleChain.push([undefined, undefined, onFinally]);
        break;
      default:
        onFinally();
        break;
    }

    return this;
  }

  private resolve(value?: any): Promise {
    this.value = value;
    if (this.value instanceof Promise) {
      this.status = Status.Pending;
      this.value.then(
        (value) => {
          this.status = Status.Resolved;
          this.value = value;
          this.execHandlerChain();
        },
        (error) => {
          this.status = Status.Rejected;
          this.error = error;
          this.execHandlerChain();
        },
      );
    } else {
      this.status = Status.Resolved;
      this.execHandlerChain();
    }

    return this;
  }

  private reject(error?: any): Promise {
    this.error = error;
    this.status = Status.Rejected;
    this.execHandlerChain();
    return this;
  }

  private execHandlerChain(): void {
    while (this.handleChain.length) {
      const [onSuccess, onFail, onFinally] = this.handleChain.shift();

      if (onFinally) {
        onFinally();
        continue;
      }
      
      switch (this.status) {
        case Status.Pending:
          return;
        case Status.Resolved:
          try {
            this.resolve(onSuccess(this.value));
          } catch (e) {
            this.error = e;
            this.status = Status.Rejected;
          }
          break;
        case Status.Rejected:
          if (onFail) {
            this.resolve(onFail(this.error));
          } else {
            continue;
          }
          break;
      }
    }
  }
}

export default Promise;
