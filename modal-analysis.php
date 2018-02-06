<div class="modal" id="analysis-settings" tabindex="-1" role="dialog" aria-labelledby="analysisSettings">
	<div class="modal-dialog modal-sm" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">Analisar Script</h4>
			</div>
			
			<div class="modal-body">
				<div class="form-group">
					<label for="analysis-invalidate-large-lines-true" class="control-label">Invalidar Linhas Largas¹:</label>
					<div class="radio">
						<label>
							<input type="radio" name="analysis-invalidate-large-lines" id="analysis-invalidate-large-lines-true"
								value="true" onchange="aade.toggleLargeLinesInvalidation(this)" />
							Sim
						</label>
					</div>
					<div class="radio">
						<label>
							<input type="radio" name="analysis-invalidate-large-lines" id="analysis-invalidate-large-lines-false"
								value="false" onchange="aade.toggleLargeLinesInvalidation(this)" />
							Não
						</label>
					</div>
				</div>
				<sub>
					1. Se ativado, blocos contendo linhas com mais de 32 caracteres
					serão considerados inválidos na prévia, e na função de analisar
					script.
				</sub>
			</div>
			
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
				<button type="button" class="btn btn-primary" onclick="aade.analyzeScript()">
					<span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span>
					Iniciar Análise
				</button>
			</div>
		</div>
	</div>
</div>