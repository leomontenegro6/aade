<?php
require_once('utils/aade.php');

$characters_codes = aade::getEquivalenceTable();
?>
<div class="panel panel-default">
	<div class="panel-body">
		<table id="equivalence-table" class="table table-bordered table-hover table-striped">
			<caption>Personagens</caption>
			<thead>
				<tr>
					<th>Código</th>
					<th>Nome Original</th>
					<th>Nome Adaptado</th>
				</tr>
			</thead>
			<tbody>
				<?php foreach($characters_codes as $code=>$character){ ?>
					<tr>
						<td><?php echo $code ?></td>
						<td>
							<input type="text" name="character[<?php echo $code ?>][original_name]"
								value="<?php echo $character['original'] ?>" class="form-control original-name" data-default="true" />
						</td>
						<td>
							<input type="text" name="character[<?php echo $code ?>][adapted_name]"
								value="<?php echo $character['adapted'] ?>" class="form-control adapted-name" data-default="true" />
						</td>
					</tr>
				<?php } ?>
			</tbody>
		</table>
	</div>
</div>