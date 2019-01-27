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
</head>
<body>
  <main id="index">
    <div class="titleDiv" id="titleDiv">
      <div>
        <h1 class="titleDiv__title">HOME DEFENDER</h1>    
        <button type="button" class="titleDiv__button" id="titleDiv__button" data-toggle="modal" data-target="#confirmationModal">Play Home Defender</button>

      </div>
    </div>

    <div class="modal fade" id="confirmationModal" tabindex="-1" role="dialog" aria-labelledby="confirmationModalTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <form action="index.php" method="POST">
              <div class="formDiv" id="formDiv">
                <div>
                  <h2>Enter Your Name</h2>
                </div>

                <!-- NAME INPUT -->
                <input type="text" class="formDiv__nameInput" id="formDiv__nameInput" name="playerName">

                <div>
                  <button type="button" class="button btn-secondary" data-dismiss="modal">Cancel</button>
                  <button type="submit" class="formDiv__button" id="formDiv__button" name="submit_button">Defend Your Home</button>
                </div>
              </div>
            </div>
          </form>      
        </div>
      </div>
    </div>
    <?php
    if(isset($_POST["submit_button"]))
    {
      $insertStmt = $conn->prepare("INSERT INTO player VALUES (DEFAULT, :player_name)");
      $player = $_POST['playerName'];
      filter_var($player, FILTER_SANITIZE_SPECIAL_CHARS);
      $insertStmt->bindParam(':player_name', $player);
      // $currentPlayer = $conn->lastInsertId();
      try 
      {
        $insertStmt->execute();
        header("Location: td.php?status=success&player=$player");
        $_POST = array();
      } 
      catch(PDOException $e) 
      {
        echo 'PDOException: ' . $e->getMessage();
      }                  
    }     
    ?>

  </main>
</body>
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
</html>

