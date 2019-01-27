<?php include('inc/db.php');?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>HOME DEFENDER</title>
  <meta name="viewport" content="width=device-width">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  <style>@import url('https://fonts.googleapis.com/css?family=VT323');</style>
  <link rel="stylesheet" href="stylesheets/css/index.css">
  <link rel="stylesheet" href="stylesheets/css/scoreboard.css">
</head>
<body>
  <main id="index">
    <div class="titleDiv" id="titleDiv">
      <h1 class="titleDiv__title">Score Board</h1>
      <div>
        <table style="color: red;">
          <tbody>
            <tr>
              <th>Player Name</th>
              <th>Score</th>
            </tr>
            <?php

          //Select statement
            $sql = "select * from player";
          //Select query on PDO
            $conn->query($sql);

          //Loop thourgh database table and display the list of recipe names
          //Create a hyperlink to the individual recipe pages using the url query string to display individual recipe id.
            if($conn_status = true){
              foreach ($conn->query($sql) as $row) {
                echo
                "<tr>
                <td>" .
                $row['player_name'] .
                "</td>" .
                "<td>" . 
                $row['score'] .
                "</td>" .
                "</tr>";
              }
            }
            ?>
          </tbody>
        </table>    
      </div>
      <div>
        <a href="index.php"><button class="button">Back to Main Page</button></a>
      </div>

    </div>


  </main>
</body>
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
</html>
<?php
if(isset($_POST["submit-score"]))
{
  $insertStmt = $conn->prepare(
    "INSERT INTO player 
    VALUES (
    DEFAULT, 
    :player_name, 
    :score)");

  $score = $_POST['finalScore'];
  $player = $_POST['testName'];

  //Sanitize input
  filter_var($score, FILTER_SANITIZE_SPECIAL_CHARS);
  filter_var($player, FILTER_SANITIZE_SPECIAL_CHARS);

  //Bind query parameters
  $insertStmt->bindParam(':player_name', $player);
  $insertStmt->bindParam(':score', $score);
  try 
  {
    $insertStmt->execute();
    $currentPlayerId = $conn->lastInsertId();
    header("Location: scoreboard.php?status=success");
  } 
  catch(PDOException $e) 
  {
    echo 'PDOException: ' . $e->getMessage();
  }                  
}     
?>