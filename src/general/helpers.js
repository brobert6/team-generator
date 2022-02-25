export const getPlayerScore = (playerScores, scoredPlayerId, type) => {
  if (playerScores != null) {
    const playerScoreObj = playerScores.find(
      (s) => s.playerId === scoredPlayerId
    );
    if (playerScoreObj !== undefined) {
      switch (type) {
        case "attack":
          return playerScoreObj.attack <= 10
            ? playerScoreObj.attack * 10
            : playerScoreObj.attack;
        case "defense":
          return playerScoreObj.defense <= 10
            ? playerScoreObj.defense * 10
            : playerScoreObj.defense;
        case "stamina":
          if (playerScoreObj.stamina !== undefined)
            return playerScoreObj.stamina;
          else if (playerScoreObj.construction !== undefined)
            return Math.ceil(
              ((parseInt(playerScoreObj.construction) +
                parseInt(playerScoreObj.resistence) +
                parseInt(playerScoreObj.technique)) *
                10) /
                3
            );
          break;
        default:
          break;
      }
    }
  }
  return 0;
};

function getCombinationItem(allPlayers, combPlayers, r) {
  const teamA = combPlayers;
  const teamAIds = teamA.map((player) => {
    return player.id;
  });
  const teamB = allPlayers.filter((p) => teamAIds.indexOf(p.id) < 0);

  return {
    teamAIds: teamAIds,
    attackA: teamA.reduce(function (previousValue, currentValue) {
      return previousValue + currentValue.attack;
    }, 0),
    defenseA: teamA.reduce(function (previousValue, currentValue) {
      return previousValue + currentValue.defense;
    }, 0),
    staminaA: teamA.reduce(function (previousValue, currentValue) {
      return previousValue + currentValue.stamina;
    }, 0),

    teamBIds: teamB.map((player) => {
      return player.id;
    }),
    attackB: teamB.reduce(function (previousValue, currentValue) {
      return previousValue + currentValue.attack;
    }, 0),
    defenseB: teamB.reduce(function (previousValue, currentValue) {
      return previousValue + currentValue.defense;
    }, 0),
    staminaB: teamB.reduce(function (previousValue, currentValue) {
      return previousValue + currentValue.stamina;
    }, 0),
  };
}

// Javascript program to print all
// combination of size r in an array of size n

/* arr[] ---> Input Array
	data[] ---> Temporary array to store current combination
	start & end ---> Starting and Ending indexes in arr[]
	index ---> Current index in data[]
	r ---> Size of a combination to be printed */
function combinationUtil(arr, data, start, end, index, r, combinations) {
  // Current combination is ready to be printed, print it
  if (index === r) {
    combinations.push(getCombinationItem(arr, data.slice(0, r), r));
  }

  // replace index with all possible elements. The condition
  // "end-i+1 >= r-index" makes sure that including one element
  // at index will make a combination with remaining elements
  // at remaining positions
  for (let i = start; i <= end && end - i + 1 >= r - index; i++) {
    data[index] = arr[i];
    combinationUtil(arr, data, i + 1, end, index + 1, r, combinations);
  }
}

// The main function that prints all combinations of size r
// in arr[] of size n. This function mainly uses combinationUtil()
export function getCombinations(arr, n, r, combinations) {
  // A temporary array to store all combination one by one
  let data = new Array(r);

  // Print all combination using temporary array 'data[]'
  combinationUtil(arr, data, 0, n - 1, 0, r, combinations);
}
