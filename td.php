<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>TD</title>
  <meta name="viewport" content="width=device-width">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  <link rel="stylesheet" type="text/css" href="td.css">
  <link rel="stylesheet" type="text/css" href="stylesheets/css/ui.css">
  <style>@import url('https://fonts.googleapis.com/css?family=VT323');</style>
</head>
<body>
  <?php include('inc/headerUI.php');?>
  <?php include('inc/backToScreen.php');?>
  <?php include('inc/submitScoreModal.php');?>

  <main id="main">
    <div id="messages"></div>
    <div class="page-wrapper flex-container">
      <canvas id="game-canvas" width="1000" height="600">
        Your browser does not support the HTML5 canvas tag.
      </canvas>
      <?php include('inc/gamePanel.php');?>
    </div>
    <button id="start-button" type="button">Start Game</button>

    <!--    
      Moved Buttons to submitScoreModal.php
      <button id="submit-score" type="button">Submit Score</button>
      <button id="restart" type="button">Restart</button> 
    -->
  </main>
  <?php include('inc/footerUI.php')?>  
  <script src="td.js" ></script>
  <script src="gamePanel.js"></script>
</body>
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>



</html>