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
              <?php
              if(isset($_POST["submitScore"]))
              {
                $insertStmt = $conn->prepare("INSERT INTO scoreboard VALUES (DEFAULT, :score, :player_id)");
                $score = $_POST['finalScore'];
                $playerId = $_REQUEST['player_id'];
                filter_var($score, FILTER_SANITIZE_SPECIAL_CHARS);
                filter_var($playerId, FILTER_SANITIZE_SPECIAL_CHARS);
                $insertStmt->bindParam(':score', $score);
                $insertStmt->bindParam(':player_id', $playerId);
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
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

