const maze_div = document.querySelector('#maze'),
      result_div = document.querySelector('#result');

const UTIL = {
    set_maze (maze_data, begin, end) { // set maze by maze_data
        maze_div.innerHTML = '';

        for (let i = 0; i < maze_data.length; i++) {
            let row = document.createElement('div');
            row.setAttribute('class', 'row');
            for (let j = 0; j < maze_data[i].length; j++) {
                row.innerHTML += `<div class="block" data-value="${maze_data[i][j]}" data-row="${i}" data-col="${j}"></div>`;
            }
            maze_div.appendChild(row);
        }

        begin = begin || [0, 0];
        end = end || [maze_data.length - 1, (maze_data[0] || []).length - 1];

        maze_div.querySelector(`[data-row="${begin[0]}"][data-col="${begin[1]}"]`).classList.add('begin');
        maze_div.querySelector(`[data-row="${end[0]}"][data-col="${end[1]}"]`).classList.add('end', 'dbl-set');

        result_div.innerText = '';
    },

    blank_data (rows, cols) { // generate blank data (rows * cols)
        let data = [];
        for (let i = 0; i < rows; i++) {
            data.push((new Array(cols)).fill(1));
        }
        return data;
    },

    maze_info (maze_div) { // get maze info : data, begin, end
        let data = [];

        [].slice.call(maze_div.querySelectorAll('.row')).forEach(row_div => {
            let row_data = [];
            [].slice.call(row_div.querySelectorAll('.block')).forEach(block_div => {
                row_data.push(+block_div.dataset.value);
            });
            data.push(row_data);
        });

        let begin_block = maze_div.querySelector('.begin'), end_block = maze_div.querySelector('.end');
        let [begin, end] = [
            [+begin_block.dataset.row, +begin_block.dataset.col],
            [+end_block.dataset.row, +end_block.dataset.col]
        ];

        return {data, begin, end}
    },

    find_path (maze_data, begin, end) { // find path from begin to end by BFS
        let nodes = new Set();
        nodes.add(new Node(begin));

        let target = null;
        while (!target && nodes.size) { // until find the target or try all possibility
            let new_nodes = new Set();
            nodes.forEach(node => {
                if (target) return;

                if (node.val[0] === end[0] && node.val[1] === end[1]) {
                    target = node;
                    return;
                }

                let left_node = node.left(maze_data);
                if (left_node) new_nodes.add(left_node);

                let right_node = node.right(maze_data);
                if (right_node) new_nodes.add(right_node);

                let top_node = node.up(maze_data);
                if (top_node) new_nodes.add(top_node);

                let bottom_node = node.down(maze_data);
                if (bottom_node) new_nodes.add(bottom_node);
            });
            nodes = new_nodes;
        }
        return target;
    }
};

class Node {
    constructor (val, pre = null) {
        this.val = val;
        this.pre = pre;
    }

    valid (maze_data) { // check a node whether is valid or not
        let [row, col] = this.val;
        if (!maze_data[row] || !maze_data[row][col]) return false;
        let pre_node = this.pre;
        while (pre_node) {
            if (pre_node.val[0] === row && pre_node.val[1] === col) return false;
            pre_node = pre_node.pre;
        }
        return true;
    }

    left (maze_data) {
        let node = new Node([this.val[0] - 1, this.val[1]], this);
        return node.valid(maze_data) ? node : null;
    }

    right (maze_data) {
        let node = new Node([this.val[0] + 1, this.val[1]], this);
        return node.valid(maze_data) ? node : null;
    }

    up (maze_data) {
        let node = new Node([this.val[0], this.val[1] - 1], this);
        return node.valid(maze_data) ? node : null;
    }

    down (maze_data) {
        let node = new Node([this.val[0], this.val[1] + 1], this);
        return node.valid(maze_data) ? node : null;
    }
}

maze_div.addEventListener('click', e => { // click to switch path / barrier
    e.target.dataset.value = 1 - +e.target.dataset.value;
});

maze_div.addEventListener('dblclick', e => { // set begin / end
    let mark = maze_div.querySelector('.begin.dbl-set') ? 'begin' : 'end';

    maze_div.querySelector(`.${mark}.dbl-set`).classList.remove(mark, 'dbl-set');
    e.target.classList.add(mark);

    maze_div.querySelector(`.${mark === 'begin' ? 'end' : 'begin'}`).classList.add('dbl-set');
});

document.querySelector('#example1').addEventListener('click', () => { // set example maze 1
    let data = UTIL.blank_data(7, 30);
    let barriers = [[1, 0],[1, 4],[1, 6],[1, 7],[1, 8],[1, 9],[1, 11],[1, 12],[1, 13],[1, 15],[1, 16],[1, 17],[1, 19],[1, 21],[1, 24],[1, 26],[1, 27],[1, 28],[1, 29],[2, 0],[2, 1],[2, 4],[2, 6],[2, 9],[2, 11],[2, 15],[2, 21],[2, 23],[2, 26],[2, 29],[3, 0],[3, 2],[3, 4],[3, 6],[3, 9],[3, 11],[3, 12],[3, 13],[3, 15],[3, 16],[3, 17],[3, 19],[3, 21],[3, 22],[3, 26],[3, 29],[4, 0],[4, 3],[4, 4],[4, 6],[4, 9],[4, 13],[4, 17],[4, 19],[4, 21],[4, 23],[4, 26],[4, 28],[4, 29],[5, 0],[5, 4],[5, 6],[5, 7],[5, 8],[5, 9],[5, 11],[5, 12],[5, 13],[5, 15],[5, 16],[5, 17],[5, 19],[5, 21],[5, 24],[5, 26],[5, 27],[5, 29]];
    barriers.forEach(([row, col]) => {
        data[row][col] = 0;
    });
    UTIL.set_maze(data, [3, 3], [5, 28]);
});

document.querySelector('#example2').addEventListener('click', () => { // set example maze 1
    let data = UTIL.blank_data(16, 16);
    let barriers = [[0, 1],[0, 4],[0, 5],[0, 10],[0, 12],[1, 1],[1, 8],[1, 10],[1, 14],[2, 1],[2, 3],[2, 4],[2, 6],[2, 8],[2, 10],[2, 12],[2, 13],[3, 1],[3, 4],[3, 5],[3, 10],[4, 5],[4, 7],[4, 8],[4, 9],[4, 11],[4, 13],[4, 15],[5, 2],[5, 3],[5, 4],[5, 9],[5, 11],[5, 13],[5, 15],[6, 1],[6, 6],[6, 7],[6, 11],[6, 13],[7, 1],[7, 3],[7, 5],[7, 6],[7, 8],[7, 9],[7, 11],[7, 13],[8, 1],[8, 3],[8, 6],[8, 8],[8, 11],[8, 14],[9, 1],[9, 3],[9, 5],[9, 13],[10, 1],[10, 4],[10, 6],[10, 7],[10, 9],[10, 11],[10, 12],[10, 14],[11, 2],[11, 6],[11, 11],[12, 0],[12, 3],[12, 8],[12, 9],[12, 13],[12, 15],[13, 2],[13, 5],[13, 7],[13, 9],[13, 10],[13, 12],[14, 1],[14, 4],[14, 13],[14, 14],[15, 3],[15, 5],[15, 8],[15, 11],[15, 14]];
    barriers.forEach(([row, col]) => {
        data[row][col] = 0;
    });
    UTIL.set_maze(data);
});

document.querySelector('#example3').addEventListener('click', () => { // set example maze 2
    let data = UTIL.blank_data(9, 10);
    let barriers = [[1, 1],[1, 2],[1, 3],[1, 4],[1, 5],[1, 6],[1, 7],[1, 8],[2, 1],[3, 1],[4, 1],[4, 2],[4, 3],[4, 4],[4, 5],[4, 6],[4, 7],[4, 8],[5, 8],[6, 8],[7, 1],[7, 2],[7, 3],[7, 4],[7, 5],[7, 6],[7, 7],[7, 8]];
    barriers.forEach(([row, col]) => {
        data[row][col] = 0;
    });
    UTIL.set_maze(data, [3, 2], [6, 7]);
});

document.querySelector('#search').addEventListener('click', () => { // start search
    result_div.innerText = `searching path...`;
    [].slice.call(maze_div.querySelectorAll('.path')).forEach(block => {
        block.classList.remove('path');
    });

    setTimeout(() => { // setTimeout would execute the time-consuming `find_path` function after DOM changed
        let info = UTIL.maze_info(maze_div);

        let path = UTIL.find_path(info.data, info.begin, info.end);
        let count = 0;

        while (path) { // mark path
            maze_div.querySelector(`[data-row="${path.val[0]}"][data-col="${path.val[1]}"]`).classList.add('path');
            path = path.pre;
            count++;
        }

        result_div.innerText = count
            ? `the shortest path is ${count} step.`
            : `there is no path.`;
    }, 0);
});

document.querySelector('#example1').click();