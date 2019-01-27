<div class="modal fade" id="submitScore" tabindex="-1" role="dialog" aria-labelledby="confirmationModalTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <div class="formDiv" id="formDiv">
          <div>
            <form action="" method="POST">
              <h2 id="win-lose-status"></h2>
              <input id="displayScore" value="" name="finalScore" disabled>
              <button type="button" id="restart">Back To Main Page</button>
              <button type="submit" class="formDiv__button" id="submit-score" name="submitScore">Submit Score</button></a>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<?php
if(isset($_POST["submitScore"]))
{
  $conn->prepare("INSERT INTO player VALUES (NULL, :player_name, :score)");
  $score = $_POST['finalScore'];
  $player = $_REQUEST['player'];

                //Sanitize input
  filter_var($score, FILTER_SANITIZE_SPECIAL_CHARS);
  filter_var($player, FILTER_SANITIZE_SPECIAL_CHARS);

                //Bind query parameters
  $insertStmt->bindParam(':score', $score);
  $insertStmt->bindParam(':player_name', $player);
  try 
  {
    $insertStmt->execute();
    $currentPlayerId = $conn->lastInsertId();
    header("Location: scoreboard.php?status=success");
    $_POST = array();
  } 
  catch(PDOException $e) 
  {
    echo 'PDOException: ' . $e->getMessage();
  }                  
}     
?>