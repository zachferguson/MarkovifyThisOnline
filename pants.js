let counter = function(arr){
  return 'Array is made up of ' + arr.length + ' elements';
};

let adder = function(a, b){
  return `the sum of the inputs is ${a+b}`;
};

let pi = 3.142;
//console.log(counter(['pants', 'hosen', 'pantaloons']));


module.exports = {
  counter: counter,
  adder: adder,
  pi: pi
};
