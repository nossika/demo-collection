/*

购票系统设计

座位图：座位分abcd四个区域，每个区域为梯形，第一排50座，每排递增2个座位，最后一排100座。

要求：

1. 实现购票方法，允许用户一次购买1-5张票，且票是同排连号
2. 系统随机分配出票的座位（当前可用的所有解法中，每一个解法被抽取的概率都是相等的）


解题思路：

1. 初始化时，生成一个三维数组，第一维表示区域，第二维表示排号，第三维表示座位号，用0和1表示是否空座；并在表示排号的数组中加入序列字段，来缓存该排剩余的连续空位情况。
2. 每次产生购买时，将满足需求的连续空位序列，按权重加入随机池（权重为该序列可提供的解法数量，使得全部解法的被抽中的概率相等），保证真正意义上的随机。
3. 从随机池中随机抽取一个结果输出，如果随机池为空，则会返回空结果，表示已经没有足够的空位。
4. 完成购买行为后，将受影响的排的序列字段更新。
5. 下次购买则继续重复步骤2-4

*/

(() => {

// 生成座位图，seats[1][2][3]表示b区3排4座（座位下标是从0开始）
function genSeats() {
  function genTrapezoid(w, h, grad) {
    const ret = [];
    for (let i = 0; i <= h; i++) {
      const row = new Array(w + i * grad).fill(0);
      row._sequences = new Map([
        [0, row.length],
      ]);
      ret.push(row);
    }
    return ret;
  }
  return [
    genTrapezoid(50, 25, 2),
    genTrapezoid(50, 25, 2),
    genTrapezoid(50, 25, 2),
    genTrapezoid(50, 25, 2),
  ];
}

// 内部属性用symbol作指针，确保其仅能在内部被使用
const SEATS_SYMBOL = Symbol('seats');
const LIMIT_SYMBOL = Symbol('limit');
const RANDOM_PICK_SYMBOL = Symbol('randomPick');
const UPDATE_ROW_SEQUENCES_SYMBOL = Symbol('updateRowSequences');


// 购票系统
class TicketSystem {

  constructor({ seats = genSeats(), limit = [1, 5] } = {}) {
    this[SEATS_SYMBOL] = seats;
    this[LIMIT_SYMBOL] = limit;
  }

  buy(num = 1) {
    if (typeof num !== 'number' || Number.isNaN(num)) {
      throw 'num should be a valid number';
    }
    if (num < this[LIMIT_SYMBOL][0] || num > this[LIMIT_SYMBOL][1]) {
      throw 'num out of range';
    }

    // 计算出满足需求的一个随机解result
    const result = this[RANDOM_PICK_SYMBOL](num);
    
    // result为null表示已无足够的连续空位
    if (!result) {
      return [];
    }

    const [areaIndex, rowIndex, begin] = result;

    // tickets表示购票成功的座位，比如 [[1,2,10],[1,2,11]] 表示座位 b区3座11号 和 b区3座12号
    const tickets = [];

    // 基于result这个随机解，去组装出最后的tickets，并且把座位图中的对应座位改为1表示已售出
    for (let i = 0; i < num; i++) {
      const seat = begin + i;
      tickets.push([areaIndex, rowIndex, seat]);
      this[SEATS_SYMBOL][areaIndex][rowIndex][seat] = 1;
    }

    // 对于受此次购买影响的座位排，重新计算其连续空位的情况（_sequences）并缓存
    this[UPDATE_ROW_SEQUENCES_SYMBOL](this[SEATS_SYMBOL][areaIndex][rowIndex]);
  
    return tickets;
  }

  // 返回当前座位图
  getSeats() {
    return this[SEATS_SYMBOL];
  }

  // 该函数用于从row(格式类似[0,0,1,0,0,0,0,1,1])中从标记出连续为0的各个子数列，缓存在row._sequences
  // sequences是用Map的键值对分别对应起始序号和连续0的个数。举个例子来理解该字段的意义，比如new Map([[1,5],[10,3]])，表示这排的空位情况为：从2座（包括2）开始有连续5个空位，从11座开始有连续3个空位。
  [UPDATE_ROW_SEQUENCES_SYMBOL](row) {
    let i = row.findIndex(seat => seat === 0);
    if (i === -1) return;
    const sequences = new Map();
    let begin = i, count = 0;

    // 对row遍历，row的每项只遍历一次
    while (i < row.length) {
      if (row[i]) { // 如果遇到1，则把当前计数计入Map，重置计数
        count && sequences.set(begin, count);
        count = 0;
      } else {
        if (!count) {
          begin = i;
        }
        count++;
      }
      i++;
    }
    count && sequences.set(begin, count);
    row._sequences = sequences;
  }

  [RANDOM_PICK_SYMBOL](num) {
    // 生成随机池。随机池是一个有多个锚点的数组，其最终格式为[,,anchor1,,,,anchor2]，锚点前面的空项表示其权重，抽取时从随机池长度内随机抽取一个整数，向后选取离该整数最近的锚点作为抽取结果（且把整数离锚点的距离，作为下一步的一个随机因子）。
    // 虽然最后randomPool会有很多空项，但这种直接赋值方式会使其以稀疏数组模式存储，这些空项实际上不会占用太多空间
    const randomPool = [];

    // 随机池锚点index
    let anchor = -1;

    // 遍历所有空位序列(row._sequences)，对于每段sequence只遍历一次
    this[SEATS_SYMBOL].forEach((area, areaIndex) => {
      area.forEach((row, rowIndex) => {
        for (let [begin, count] of row._sequences.entries()) {
          if (count >= num) { // 如果该序列的空位数满足需求，则按权重将该序列设为随机池数组中的一个锚点
            const weight = count - num + 1;
            anchor += weight;
            randomPool[anchor] = [areaIndex, rowIndex, begin];
          }
        } 
      });
    });

    // 如果随机池为空，则说明已经没有满足需求的连续空位，返回null
    if (!randomPool.length) {
      return null;
    }

    // 从随机池数组中随机取一个index，向后取离其最近的锚点作为结果
    const pick = Math.random() * randomPool.length | 0;

    let i = pick;
    while(!randomPool[i]) {
      i++;
    }

    // 该序列的areaIndex，rowIndex可以直接作为结果，begin则要加上一个随机offset值（这里直接使用pick里锚点的距离作为offset）作为最终结果
    const [areaIndex, rowIndex, begin] = randomPool[i];
    const offset = i - pick;
    const trueBegin = begin + offset;

    // 最后得到的解：areaIndex, rowIndex, trueBegin，再结合num，就能得出最终的连续座位
    // 比如结果是[1,2,3]，num为4，则表示最终的座位为：从 b区3排4座 开始的连续4个座位
    return [areaIndex, rowIndex, trueBegin];
  }

}

window.TicketSystem = TicketSystem;

})();