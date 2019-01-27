<div class="modal fade" id="submitScore" tabindex="-1" role="dialog" aria-labelledby="confirmationModalTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <div class="formDiv" id="formDiv">
          <div>
            <form action="scoreboard.php" method="POST">
              <h2 id="win-lose-status"></h2>
              Score: <input id="displayScore" value="" name="finalScore" readonly>
              <input type="hidden" name="testName" value="<?= $_REQUEST['playerName'];?>">
              <button type="button" id="restart">Back To Main Page</button>
              <button type="submit" class="formDiv__button" id="submit-score" name="submit-score">Submit Score</button></a>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
