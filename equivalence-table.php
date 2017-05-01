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
				<?php
				foreach($characters_codes as $code=>$character){
					include('equivalence-table-add.php');
				}
				?>
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