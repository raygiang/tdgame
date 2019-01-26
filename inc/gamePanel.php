 <form id="game-panel" name="game_panel">
  <h2>Game Panel</h2>
  <div id="tower-select">
	<h3>Towers</h3>
	<label for="arrow-tower"><img class="tower_img" src="images/siegeBallista.png" alt="Arrow Tower"/></label>
	<input type="radio" id="arrow-tower" name="tower_select" value="1" />
	<br />
	<label for="laser-tower"><img class="tower_img" src="images/towerDefense__laser.png" alt="Laser Tower" /></label>
	<input type="radio" id="laser-tower" name="tower_select" value="2" />
	<br />
	<label for="artillery-tower"><img class="tower_img" src="images/towerDefense_artillery.png" alt="Artillery Tower"/></label>
	<input type="radio" id="artillery-tower" name="tower_select" value="3" />
	<br />
	<label for="cannon-tower"><img class="tower_img" src="images/towerDefense_cannon.png" alt="Canon Tower"/></label>
	<input type="radio" id="cannon-tower" name="tower_select" value="4" />
	<br />
    <button id="upgrade" type='button'>Upgrade Tower</button>
  </div>
  <div id="items">
    <h3>Your Items</h3>
  </div>
</form>
