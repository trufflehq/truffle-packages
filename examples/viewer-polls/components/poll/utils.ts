// https://gist.github.com/scwood/e58380174bd5a94174c9f08ac921994f
type IntermediateRound = {
  floor: number;
  remainder: number;
  index: number;
};

export function largestRemainderRound(
  numbers: number[] | undefined,
  desiredTotal: number,
) {
  if (!numbers?.length) return;

  const result = numbers.map(function (number, index) {
    const intermediate: IntermediateRound = {
      floor: Math.floor(number),
      remainder: getRemainder(number),
      index: index,
    };

    return intermediate;
  }).sort(function (a: IntermediateRound, b: IntermediateRound) {
    return b.remainder - a.remainder;
  });

  const lowerSum = result.reduce(function (sum, current) {
    return sum + current.floor;
  }, 0);

  const delta = desiredTotal - lowerSum;

  if (delta !== desiredTotal) {
    for (let i = 0; i < delta; i++) {
      result[i].floor++;
    }
  }

  return result.sort(function (a, b) {
    return a.index - b.index;
  }).map(function (result) {
    return result.floor;
  });
}

function getRemainder(number) {
  const remainder = number - Math.floor(number);
  return parseInt(remainder.toFixed(4));
}

export function getPollTimeRemaining(pollEndTime: Date) {
  const start = new Date().getTime();
  const end = new Date(pollEndTime).getTime();
  const timeRemaining = (end - start) / 1000;

  return timeRemaining;
}
