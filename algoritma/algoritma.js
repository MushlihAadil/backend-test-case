// Number 1 ===============================================>
const string = "NEGIE1";

function reverse(str) {
  const letters = str.match(/[a-z]/gi).reverse().join("");
  const number = str.match(/\d/g);

  return letters + number;
}

console.log(reverse(string));

/*
New topic : 
flag g = global, semua letter dikembalikan
flag i = case-insensitive 
*/

// Number 2 ===============================================>
const sentence = "Saya sangat senang mengerjakan soal algoritma";

function longestWord(str) {
  const words = str.split(" ");

  let longest = "";
  let maxLength = 0;
  for (let word of words) {
    if (word.length > maxLength) {
      longest = word;
      maxLength = word.length;
    }
  }

  return `${longest}: ${maxLength} character`;
}

console.log(longestWord(sentence));
// Number 3 ===============================================>
const INPUT = ["xc", "dz", "bbb", "dz"];
const QUERRY = ["bbb", "ac", "dz"];

function countQuerry(input, querry) {
  const result = [];

  querry.forEach((querryString) => {
    let count = 0;

    input.forEach((inputString) => {
      if (inputString === querryString) {
        count++;
      }
    });

    result.push(count);
  });

  return result;
}
console.log(countQuerry(INPUT, QUERRY));

// Number 4 ===============================================>
const Matrix = [
    [1,2,0],
    [4,5,6],
    [7,8,9]
]

const countDiagonal1 = Matrix[0][0] + Matrix[1][1] + Matrix[2][2]
const countDiagonal2 = Matrix[0][2] + Matrix[1][1] + Matrix[2][0]
const minusOperation = countDiagonal1 - countDiagonal2

console.log(minusOperation);

