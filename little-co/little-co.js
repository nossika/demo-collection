function co (generator) {
    const g = generator();
    function run (promise) {
        if(!promise) return;
        promise.then((value)=>{
            run(g.next(value).value);
        });
    }
    run(g.next().value);
}

