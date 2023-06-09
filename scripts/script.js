let playerId = 1;
let players = [];
let currentPlayerIndex = 0;
let currentPlayerColor = "White";
let sessionPlayerColor = "White";
let currentPlayer;

function joinGame() {
  const playerName = document.getElementById("player_name").value;
  const playerColor = (playerId === 1) ? "White" : "Black";

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'php/join_session.php', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // Call the fetchSessionData function after a short delay
      fetchSessionData();
    }
  };
  xhr.send('player_name=' + encodeURIComponent(playerName) + '&color=' + encodeURIComponent(playerColor));
}


function resetSession() {
  $.ajax({
    url: 'php/reset_session.php',
    method: 'GET',
    success: function() {
      $(document.getElementById("nameButton")).removeClass("hidden");
      diceButton.disabled =
      // Session reset is successful, perform any additional actions if needed
      alert('Session has been reset for all users.');
    },
    error: function(error) {
      console.error('Error:', error);
      // Handle the error case
      alert('Failed to reset session.');
    }
  });
}
  
// Add an event listener to the form submit button
const nameButton = document.getElementById("nameButton");
nameButton.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default form submission
    // Call the function to submit the form asynchronously
    joinGame();
    $(this).addClass("hidden");
});


// Make an AJAX request to a PHP script that returns session data
function fetchSessionData() {
    $.ajax({
      url: 'php/get_session_data.php',
      method: 'GET',
      dataType: 'json',
      success: function(sessionData) {
        // Access the session data in JavaScript
        const username = sessionData.username;
        const color = sessionData.color;
  
        // Use the session data as needed
        console.log('Username:', username);
        console.log('Color:', color);
        sessionPlayerColor = color
      },
      error: function(error) {
        console.log('Error:', error);
      }
    });
  }

function fetchPlayerData() {
    $.ajax({
      url: 'php/fetch_players.php',
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        console.log('Received player data:', data);
  
        // Update the players array with the received data
        players = data;
  
        // Find the first player with color "Black" and set currentPlayerColor accordingly
        let blackPlayer = players.find(function(player) {
          return player.color === "Black";
        });
  
        // Find the first player with color "White" and set currentPlayerColor accordingly
        let whitePlayer = players.find(function(player) {
          return player.color === "White";
        });
  
        renderPlayerPositions();
        checkTurn();
      },
      error: function(error) {
        console.log('Error:', error);
      }
    });
  }
  

// Function to render player positions
function renderPlayerPositions() {
  $('.box').find('img').remove();

    players.forEach(function(player) {
        console.log(player);
        let boxId = player.position;
        let boxElement = document.getElementById(boxId);
        let playerElement = document.createElement('img');
        playerElement.setAttribute("id", "Playerimg");
        playerElement.className = "player";
        if (player.color == "White") {
            playerElement.classList.add('marginWhite');
            playerElement.src = "img/goose1.png";
        } else if (player.color == "Black") {
            playerElement.classList.add('marginBlack');
            playerElement.src = "img/goose2.png";
        }

        playerElement.alt = player.id;

        if (!boxElement.classList.contains('start')) {
            playerElement.classList.add('marginTop');
        }

        playerElement.id = 'player-' + player.id;

        boxElement.appendChild(playerElement);
    });
}

function checkTurn() {
  console.log(sessionPlayerColor, currentPlayerIndex)
  let beurtDivWit = document.getElementById("beurtDivWit");
  let beurtDivZwart = document.getElementById("beurtDivZwart");

  currentPlayerColor = players[currentPlayerIndex].color;
  console.log(currentPlayerIndex)
  if (sessionPlayerColor === "White") {
    if (Number(currentPlayerIndex) === 0) {
      beurtDivWit.classList.remove("hidden");
      beurtDivZwart.classList.add("hidden");
      diceButton.disabled = false; // Enable dice button for the session player
    } else if (Number(currentPlayerIndex) === 1) {
      beurtDivWit.classList.add("hidden");
      beurtDivZwart.classList.remove("hidden");
      diceButton.disabled = true; // Disable dice button for the opponent
    }
  }

  if (sessionPlayerColor === "Black") {
    if (Number(currentPlayerIndex) === 0) {
      beurtDivWit.classList.remove("hidden");
      beurtDivZwart.classList.add("hidden");
      diceButton.disabled = true; // Disable dice button for the opponent
    } else if (Number(currentPlayerIndex) === 1) {
      beurtDivWit.classList.add("hidden");
      beurtDivZwart.classList.remove("hidden");
      diceButton.disabled = false; // Enable dice button for the session player
    }
  }
}

// Get the button element
const diceButton = document.getElementById("diceButton");
diceButton.addEventListener("click", rollDice);

function printDice() {
    let out = document.getElementById("outputDice");
    let diced = Math.floor(Math.random() * 6) + 1;
    let image = "img/dice" + diced + ".png";
    out.innerHTML = "<img src='" + image + "'/>";

    let dicedOutput = document.getElementById("diced");
    dicedOutput.innerHTML = "Er is " + diced + " gegooid.";

    return diced;
}


function savePlayerMove(currentPlayer) {
  $.ajax({
    url: 'php/update_move.php',
    method: 'POST',
    dataType: 'json',
    data: {
      id: currentPlayer.id,
      position: currentPlayer.position,
    },
    success: function (data) {
      // Update the players array with the received data
      players = data;

      // Once the player positions are updated, render the player positions on the game board
      renderPlayerPositions();

      checkTurn();
    },
    error: function (error) {
      console.error('Error:', error);
      // Enable the dice button again in case of an error
      diceButton.disabled = false;
    }
  });
}

async function specialEvents(currentPlayer, diceValue) {
  let specialActionText = document.getElementById("special");

  while (
    currentPlayer.position == 5 ||
    currentPlayer.position == 9 ||
    currentPlayer.position == 14 ||
    currentPlayer.position == 18 ||
    currentPlayer.position == 23 ||
    currentPlayer.position == 27 ||
    currentPlayer.position == 32 ||
    currentPlayer.position == 36 ||
    currentPlayer.position == 41 ||
    currentPlayer.position == 45 ||
    currentPlayer.position == 50 ||
    currentPlayer.position == 54 ||
    currentPlayer.position == 59
  ) {
    // geese box -> forward dice value again
    currentPlayer.position += diceValue;
    specialActionText.innerHTML =
      currentPlayer.color + " mocht hetzelfde aantal nog eens lopen!";
    savePlayerMove(currentPlayer)
    await delay(300);
  }

  if (currentPlayer.position == 42) {
    // doornstruik -> from box 42 to 37
    currentPlayer.position = 37;
    specialActionText.innerHTML =
      currentPlayer.color + " is teruggeprikkeld naar 37 door de doornstruik!";
  } else if (currentPlayer.position == 6) {
    // brug -> from box 6 to 12
    currentPlayer.position = 12;
    specialActionText.innerHTML =
      currentPlayer.color + " heeft de brug genomen naar 12!";
  } else if (currentPlayer.position == 58) {
    // de dood -> from box 58 to the start
    currentPlayer.position = 1;
    specialActionText.innerHTML =
      currentPlayer.color + " is dood! " + currentPlayer.color + " moet terug naar start.";
  } else if (currentPlayer.position == 19 || currentPlayer.position == 31 || currentPlayer.position == 52) {
    // 4 stappen terug
    currentPlayer.position -= 3;
    specialActionText.innerHTML =
      currentPlayer.color + " moet 3 stappen naar achteren!";
  } else if (currentPlayer.position > 64) {
    let extra = currentPlayer.position - 64;
    currentPlayer.position = 64 - extra;
        // handle that the winner has to get to 64 exactly
  specialActionText.innerHTML =
  currentPlayer.color + ", je moet exact 64 halen!";
  renderPlayerPositions();
  } else if (currentPlayer.position == 64) {
    console.log(currentPlayer);
    let specialActionText = document.getElementById("special");
    specialActionText.innerHTML = currentPlayer.color + " heeft gewonnen!";
    diceButton.disabled = true;
    // Send user to winning screen
    location.replace("winner.php");
    // Print who won
    let winnerText = document.getElementById("winner");
    winnerText.innerHTML = currentPlayer.color + " heeft gewonnen!";
} else {
    specialActionText.innerHTML =
      currentPlayer.color + " staat op een doodnormaal vakje!";
  }
}



// Function to delay execution
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function rollDice() {
  let specialActionText = document.getElementById("special");
  console.log(sessionPlayerColor)
  // Roll the dice
  let diceValue = printDice();

  // Update the current player's position based on the dice roll
  let currentPlayer = players[currentPlayerIndex];
  console.log(currentPlayer);
  console.log(Number(currentPlayer.move + 1))
  currentPlayer.position = parseInt(currentPlayer.position, 10);
  currentPlayer.position += diceValue;
  // Move the player immediately
    // Handle special boxes after a delay
    // Perform special actions based on the player's position

  renderPlayerPositions();
  savePlayerMove(currentPlayer);
  await delay(300);
  await specialEvents(currentPlayer, diceValue);
  renderPlayerPositions();
  
  savePlayerMove(currentPlayer); 
  console.log("HIER IS DE CURRENT PLAYER INDEX", currentPlayerIndex)
  if (currentPlayer.position == 26 || currentPlayer.position == 53) {
    // opnieuw dobbelen
    currentPlayer.position = 1;
    specialActionText.innerHTML =
      currentPlayer.color + " mag opnieuw dobbelen!";
      if (currentPlayerIndex == 0){
        currentPlayerIndex = 0;
        updateTurn();
      }
      else if (currentPlayerIndex == 1){
        currentPlayerIndex = 1;
        updateTurn();
      }
  } else {
    if (currentPlayerIndex == 0){
      currentPlayerIndex = 1;
      updateTurn();
    }
    else if (currentPlayerIndex == 1){
      currentPlayerIndex = 0;
      updateTurn();
    }
  }
}

function updateTurn() {
  // Prepare the turn data to be sent to the server
  var turnData = {
    currentPlayerIndex: currentPlayerIndex
  };

  // Send the turn data to the server using AJAX
  $.ajax({
    url: 'php/update_turn.php',
    method: 'POST',
    dataType: 'json',
    cache: false,
    data: turnData,
    success: function(data) {
      console.log('Turn data updated:', data);
    },
    error: function(error) {
      console.error('Error:', error);
    }
  });
}


function fetchTurnData() {
  $.ajax({
    url: 'turn.json',
    method: 'GET',
    dataType: 'json',
    cache: false,
    success: function(turnData) {
      // Access the turn data in JavaScript
      currentPlayerIndex = turnData.currentPlayerIndex;
  
      // Use the turn data as needed
      console.log('Current Player Index:', currentPlayerIndex);
      // Update the currentPlayerIndex variable or perform any other actions with the retrieved data

      checkTurn()
    },
    error: function(error) {
      console.log('Error:', error);
    }
  });
}


fetchPlayerData();
setInterval(fetchTurnData, 100);
setInterval(fetchPlayerData, 100);



