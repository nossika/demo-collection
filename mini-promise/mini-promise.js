class MiniPromise {
    constructor (fn) {
        fn(this.resolve.bind(this), this.reject.bind(this));
        this._status = 'pending';
        this._value = undefined;
        this._handlers = [];
    }
    resolve (data) {
        this._status = 'resolved';
        this.exec(data);
    }
    exec (data, error) {
        let handler = this._handlers.shift();
        let fn;
        if (error) { // 若有error参数
            if (!handler) { // 若无下一步，抛出error
                throw error;
            } if (!handler[1]) { // 若无错误处理函数，冒泡给下一步
                this.exec(null, error);
                return;
            } else { // 若有错误处理函数，执行
                fn = handler[1];
                data = error;
            }
        } else {
            if (!handler) { // 若无下一步，停止
                return;
            } else if (!handler[0]) { // 若无数据处理函数（可能是因为catch），交给下一步
                this.exec(data);
                return;
            } else { // 若有数据处理函数，执行
                fn = handler[0];
            }

        }

        let nextData, nextError;
        try {
            nextData = fn(data);
        } catch (e) {
            nextError = e;
        }
        if (nextError) { // 若出错
            this._value = undefined;
            this.exec(null, nextError);
        } else { // 若成功
            this._value = nextData;
            if (nextData instanceof MiniPromise) {
                // todo 应该反过来把新promise的handlers拼到当前handlers，以保证当前promise的value正确
                nextData._handlers = nextData._handlers.concat(this._handlers); // 把当前的handlers拼到新promise的handlers链上
                this._handlers.length = 0;
            } else {
                this.exec(nextData);
            }
        }
    }
    reject (error) {
        this._status = 'reject';
        this.exec(null, error)
    }
    then (onSuccess, onError) {
        this._handlers.push([onSuccess, onError]);
        return this;
    }
    catch (onError) {
        this._handlers.push([null, onError]);
        return this;
    }
    finally (handler) {
        // todo 实现finally
        return this;
    }
}

