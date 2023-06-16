<?php
session_start();

// Check if the user count is not set in the session
if (!isset($_SESSION['user_count'])) {
    // Set the initial user count to 0
    $_SESSION['user_count'] = 0;
}

// Check if the player name is submitted
if (isset($_POST['player_name'])) {
    // Increment the user count and assign a color based on the count
    $_SESSION['user_count']++;
    $color = $_SESSION['user_count'] === 1 ? 'White' : 'Black';

    // Store user information in the session
    $_SESSION['username'] = $_POST['player_name'];
    $_SESSION['color'] = $color;
}

// Display connected users with their assigned colors
echo "<h2>Connected Users:</h2>";
foreach ($_SESSION as $key => $value) {
    if ($key === 'username') {
        echo "Username: $value - Color: {$_SESSION['color']}<br>";
    }
}
?>
