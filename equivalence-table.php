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
					<th width="50">&nbsp;</th>
				</tr>
			</thead>
			<tbody>
				<?php foreach($characters_codes as $code=>$character){ ?>
					<tr>
						<td class="code"><?php echo $code ?></td>
						<td>
							<input type="text" name="character[<?php echo $code ?>][original_name]" placeholder="Digite o nome original"
								value="<?php echo $character['original'] ?>" class="form-control original-name" onkeyup="aade.updatePreviewVisibleTextareas()" />
						</td>
						<td>
							<input type="text" name="character[<?php echo $code ?>][adapted_name]" placeholder="Digite o nome adaptado"
								value="<?php echo $character['adapted'] ?>" class="form-control adapted-name" onkeyup="aade.updatePreviewVisibleTextareas()" />
						</td>
						<td>
							<button type="button" class="btn btn-danger" onclick="aade.removeCharacterEquivalenceTable(this)" disabled>
								<span class="glyphicon glyphicon-remove"></span>
							</button>
						</td>
					</tr>
				<?php } ?>
			</tbody>
			<tfoot>
				<tr>
					<td colspan="100%">
						<button type="button" class="btn btn-success pull-right" onclick="aade.addCharacterEquivalenceTable(this)">
							<span class="glyphicon glyphicon-plus"></span>
						</button>
					</td>
				</tr>
			</tfoot>
		</table>
	</div>
</div>