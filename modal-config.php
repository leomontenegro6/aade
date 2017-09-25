<div class="modal" id="config-settings" tabindex="-1" role="dialog" aria-labelledby="configSettings">
	<div class="modal-dialog modal-sm" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">Configurações</h4>
			</div>
			
			<div class="modal-body">
				<div class="form-group">
					<label for="name-type-original" class="control-label">Nomes da Tabela de Equivalência:</label>
					<div class="radio">
						<label>
							<input type="radio" name="name-type" id="name-type-original" value="o"
								onchange="aade.changeDefaultNameTypes(this)" />
							Originais
						</label>
					</div>
					<div class="radio">
						<label>
							<input type="radio" name="name-type" id="name-type-adapted" value="a"
								onchange="aade.changeDefaultNameTypes(this)" />
							Adaptados
						</label>
					</div>
				</div>
				<div class="form-group">
					<label for="invalidate-large-lines-true" class="control-label">Invalidar Linhas Largas¹:</label>
					<div class="radio">
						<label>
							<input type="radio" name="invalidate-large-lines" id="invalidate-large-lines-true" value="true"
								onchange="aade.toggleLargeLinesInvalidation(this)" />
							Sim
						</label>
					</div>
					<div class="radio">
						<label>
							<input type="radio" name="invalidate-large-lines" id="invalidate-large-lines-false" value="false"
								onchange="aade.toggleLargeLinesInvalidation(this)" />
							Não
						</label>
					</div>
				</div>
				<sub>
					1. Se ativado, blocos contendo mais de 32 linhas serão
					considerados inválidos na prévia, e na função de analisar
					script.
				</sub>
			</div>
			
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
			</div>
		</div>
	</div>
</div>