function co(generator) {
  const g = generator();

  const run = (prev) => {
    const { value, done } = g.next(prev);
    if (done) return;

    if (value instanceof Promise) {
      value.then((v)=>{
        run(v);
      });
      return;
    }

    run(value);
  }

  run();
}

