<header class="header">
	<ul class="header__list">
		<li class="header__playerNameLabel">PLAYER: <?php
		echo $_REQUEST['player'];
		?></li>
		<li>Score: <input id="score" value="" name="score" disabled></li>
		<li><button type="button" class="button"data-toggle="modal" data-target="#confirmationModal">Go Back</button></li>
	</ul>
</header>