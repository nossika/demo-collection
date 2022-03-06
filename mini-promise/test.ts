import Promise from './promise';

console.log('start test');

const pSuccess = Promise.resolve('success data');
const pFail = Promise.reject('error data');

const p1 = new Promise((resolve) => {
  setTimeout(resolve, 1000, 1);
});

p1.then(() => {
  return 'value1';
}).then((value) => {
  console.log(`get ${value} from last then`);
});

p1.then(() => {
  throw 1;
}).catch((err) => {
  console.log(`catched ${err}`);
}).then(() => {
  throw 2;
}).then(() => {}, (err) => {
  console.log(`catched ${err}`);
});


const p2 = new Promise((resolve) => resolve(2));

p2.finally(() => {
  console.log('finally');
});

const p3 = Promise.resolve(3);

p3.then(() => {
  return new Promise(resolve => setTimeout(resolve, 2000, 33));
}).then(() => {
  console.log('resolved after 2s');
});
