<?php
require_once('utils/aade.php');

if(isset($code)){
	$default = true;
} else {
	$default = false;
	$code = $_GET['code'];
}
if(!isset($character)){
	$character = $_GET['character'];
}
?>
<tr>
	<td class="code"><?php echo $code ?></td>
	<td>
		<input type="text" name="character[<?php echo $code ?>][original_name]" placeholder="Digite o nome original"
			value="<?php echo $character['original'] ?>" class="form-control original-name" data-default="true" />
	</td>
	<td>
		<input type="text" name="character[<?php echo $code ?>][adapted_name]" placeholder="Digite o nome adaptado"
			value="<?php echo $character['adapted'] ?>" class="form-control adapted-name" data-default="true" />
	</td>
	<td>
		<button type="button" class="btn btn-danger" onclick="aade.removeCharacterEquivalenceTable(this)"
			<?php if($default) echo 'disabled' ?>>
			<span class="glyphicon glyphicon-remove"></span>
		</button>
	</td>
</tr>