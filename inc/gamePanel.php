 <form id="game-panel" name="game_panel">
 	<h2>Game Panel</h2>
  <div id="build-timer"></div>
  <button id="build-done" type="button">Done Building</button>
 	<div id="tower-select">
 		<h3>Towers</h3>
 		<table style="text-align:left">
 			<tbody>
 				<tr>
 					<td><label for="arrow-tower"><img class="tower_img" src="images/siegeBallista.png" alt="Arrow Tower"/> Arrow (Cost: 250)</label></td>
 					<td><input type="radio" id="arrow-tower" name="tower_select" value="1" /></td>
 				</tr>
 				<tr>
 					<td><label for="laser-tower"><img class="tower_img" src="images/towerDefense__laser.png" alt="Laser Tower" /> Laser</label></td>
 					<td><input type="radio" id="laser-tower" name="tower_select" value="2" /></td>
 				</tr>
 				<tr>
 					<td><label for="artillery-tower"><img class="tower_img" src="images/towerDefense_artillery.png" alt="Artillery Tower"/> Artillery</label></td>
 					<td><input type="radio" id="artillery-tower" name="tower_select" value="3" /></td>
 				</tr>
 				<tr>
 					<td><label for="cannon-tower"><img class="tower_img" src="images/towerDefense_cannon.png" alt="Canon Tower"/> Cannon</label></td>
 					<td><input type="radio" id="cannon-tower" name="tower_select" value="4" /></td>
 				</tr>
 			</tbody>
 		</table>
 		<button id="upgrade" type='button'>Upgrade Tower</button>
    <button id="sell" type='button'>Sell Tower</button>
 	</div>
 	<div id="items">
 		<h3>Your Items</h3>
 		<table id="inventory">
 			<tbody>
 				<tr>
 					<td><button type="button" class="items"></button></td>
 					<td><button type="button" class="items"></button></td>
 					<td><button type="button" class="items"></button></td>
 				</tr>
 				<tr>
 					<td><button type="button" class="items"></button></td>
 					<td><button type="button" class="items"></button></td>
 					<td><button type="button" class="items"></button></td>
 				</tr>
 			</tbody>
 		</table>
 	</div>
 </form>
