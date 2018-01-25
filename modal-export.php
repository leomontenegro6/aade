<div class="modal" id="export-settings" tabindex="-1" role="dialog" aria-labelledby="exportSettings">
	<div class="modal-dialog modal-sm" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">Exportar Script</h4>
			</div>
			
			<div class="modal-body">
				<div class="form-group">
					<label for="export-format" class="control-label">Formato¹:</label>
					<select id="export-format" class="form-control">
						<option value="rtf">.rtf</option>
					</select>
				</div>
				<sub>
					1. O arquivo gerado serve apenas para fins de análise e revisão,
					não servindo para traduzir.
				</sub>
			</div>
			
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
				<button type="button" class="btn btn-primary" onclick="aade.exportScript()">
					<span class="glyphicon glyphicon-export" aria-hidden="true"></span>
					Exportar
				</button>
			</div>
		</div>
	</div>
</div>