(function() {
  // game core
  class GameSnake {
    constructor(
      canvasEl,
      config = {},
    ) {
      this._canvasEl = canvasEl;
      this._ctx = canvasEl.getContext('2d');
      this.init(Object.assign({
        row: 50,
        column: 50,
        speed: 8,
        snakeColor: 'blue',
        foodColor: 'red',
      }, config));
    }
    init(config) {
      if (config) {
        this._interval = 1000 / config.speed;
        this._row = config.row;
        this._column = config.column;
        this._snakeColor = config.snakeColor;
        this._foodColor = config.foodColor;
      }

      this._clock = 0;
      this._snake = [[0, 0]];
      this._direction = 'd';
      this._food = this.genFoodPos();
      this._status = 0;
      this.resize();
    }
    headTo(direction) {
      if (['u', 'd', 'l', 'r'].includes(direction)) {
        const forbidden = {
          'u': 'd',
          'd': 'u',
          'l': 'r',
          'r': 'l',
        };
        if (forbidden[this._direction] === direction) {
          return;
        }
        this._direction = direction;
      }
    }
    resize() {
      const width = this._canvasEl.offsetWidth;
      const height =this._canvasEl.offsetHeight;
      this._canvasEl.width = width;
      this._canvasEl.height = height;
      this._blockWidth = width / this._column;
      this._blockHeight = height / this._row;
      this.draw();
    }
    start() {
      this._status = 1;
      this._timer = setInterval(() => {
        this._clock++;
        this.updateSnake();
        this.draw();
        this.check();
      }, this._interval);
    }
    end() {
      clearInterval(this._timer);
      if (typeof this.onEnd === 'function') {
        this.onEnd(this._snake.length);
      }
    }
    stop() {
      this._status = 0;
      clearInterval(this._timer);
    }
    reset() {
      this.init();
    }
    getStatus() {
      return this._status;
    }
    updateSnake() {
      const snakeHead = this._snake[0];
      let newSnakeHead = null;
      switch (this._direction) {
        case 'u':
          newSnakeHead = [snakeHead[0], snakeHead[1] - 1];
          break;
        case 'd':
          newSnakeHead = [snakeHead[0], snakeHead[1] + 1];
          break;
        case 'l':
          newSnakeHead = [snakeHead[0] - 1, snakeHead[1]];
          break;
        case 'r':
          newSnakeHead = [snakeHead[0] + 1, snakeHead[1]];
          break;
        default:
          newSnakeHead = snakeHead
      }
      this._snake.unshift(newSnakeHead);
      if (newSnakeHead[0] === this._food[0] && newSnakeHead[1] === this._food[1]) {
        this._food = this.genFoodPos();
      } else {
        this._snake.pop();
      }
    }
    check() {
      const snakeHead = this._snake[0];
      if (snakeHead[0] < 0 || snakeHead[0] >= this._column) {
        this.end();
        return;
      } else if (snakeHead[1] < 0 || snakeHead[1] >= this._row) {
        this.end();
        return;
      }
      for (let i = 1; i < this._snake.length; i++) {
        if (snakeHead[0] === this._snake[i][0] && snakeHead[1] === this._snake[i][1]) {
          this.end();
          return;
        }
      }
    }
    genFoodPos() {
      let pos = null;
      while(!pos) {
        const columnId = (Math.random() * this._column) | 0;
        const rowId = (Math.random() * this._row) | 0;
        let isValidPos = true;
        for (let i = 0; i < this._snake.length; i++) {
          if (columnId === this._snake[i][0] && rowId === this._snake[i][1]) {
            isValidPos = false;
            break;
          }
        }
        if (isValidPos) {
          pos = [columnId, rowId];
        }
      }
      return pos;
    }
    draw() {
      const ctx = this._ctx;
      ctx.clearRect(0, 0, this._canvasEl.width, this._canvasEl.height);
      ctx.fillStyle = this._snakeColor;
      for (let i = 0; i < this._snake.length; i++) {
        ctx.fillRect(
          this._snake[i][0] * this._blockWidth,
          this._snake[i][1] * this._blockHeight,
          this._blockWidth,
          this._blockHeight,
        );
      }
      ctx.fillStyle = this._foodColor;
      ctx.fillRect(
        this._food[0] * this._blockWidth,
        this._food[1] * this._blockHeight,
        this._blockWidth,
        this._blockHeight,
      );
    }
  }

  // init game
  const canvasEl = document.querySelector('#canvas');
  const gameSnake = new GameSnake(canvasEl);

  gameSnake.onEnd = score => {
    alert(`game over! your score: ${score}`);
    gameSnake.reset();
  };

  // add dom event
  window.addEventListener('resize', e => {
    gameSnake.resize();
  });

  document.querySelector('#start').addEventListener('click', e => {
    if (gameSnake.getStatus() === 1) {
      gameSnake.stop();
    } else {
      gameSnake.start();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.keyCode >= 37 && e.keyCode <= 40) {
      gameSnake.headTo(['l', 'u', 'r', 'd'][e.keyCode - 37]);
    }
  });

  // add dom event for mobile
  let startX;
  let startY;

  canvasEl.addEventListener('touchstart', e => {
    e.preventDefault();
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY; 
  }, { passive: false });

  canvasEl.addEventListener('touchmove', e => {
    e.preventDefault();
    const endX = e.changedTouches[0].pageX;
    const endY = e.changedTouches[0].pageY;
    const dy = endY - startY;
    const dx = endX - startX;
    if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;

    const angle = Math.atan2(dx, dy) * 180 / Math.PI;
    const area = (angle + 180) / 90 + 0.5 | 0;
    const directionMap = {
      0: 'u',
      1: 'l',
      2: 'd',
      3: 'r',
      4: 'u',
    };
    gameSnake.headTo(directionMap[area]);
  }, { passive: false });
})();