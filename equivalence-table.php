<?php
require_once('utils/aade.php');
?>
<div class="panel panel-default">
	<div class="panel-body">
		<div class="form-group">
			<label for="equivalence-table-field" class="control-label">Tabela de Equivalência:</label>
			<select id="equivalence-table-field" name="equivalence-table-field" class="form-control"
				onchange="aade.loadEquivalenceTable(this.value)">
				<option value="aa1">Phoenix Wright: Ace Attorney (AA1)</option>
				<option value="aa2">Phoenix Wright: Ace Attorney - Justice For All (AA2)</option>
				<option value="aa3">Phoenix Wright: Ace Attorney - Trials and Tribulations (AA3)</option>
			</select>
		</div>
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
			<tbody></tbody>
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