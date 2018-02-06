<div class="modal" id="export-settings" tabindex="-1" role="dialog" aria-labelledby="exportSettings">
	<div class="modal-dialog modal-sm" role="document">
		<div class="modal-content">
			<form class="save-file-form" onsubmit="return aade.exportScript(this)">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title">Exportar Script</h4>
				</div>

				<div class="modal-body">
					<div class="form-group">
						<label for="export-name-field" class="control-label">Nome*:</label>
						<input type="text" id="export-name-field" placeholder="Digite o nome do arquivo" onkeydown="return aade.maskFilenameInput(event)"
							class="form-control" required />
					</div>
					<div class="form-group">
						<label for="export-format-field" class="control-label">Formato¹:</label>
						<select id="export-format-field" class="form-control">
							<option value="rtf">.RTF</option>
						</select>
					</div>
					<p class="help-block">* Campo obrigatório</p>
					<sub>
						1. O arquivo gerado serve apenas para fins de análise e revisão,
						não servindo para traduzir.
					</sub>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
					<button type="submit" class="btn btn-primary">
						<span class="glyphicon glyphicon-export" aria-hidden="true"></span>
						Exportar
					</button>
				</div>
			</form>
		</div>
	</div>
</div>