<div class="modal" id="config-settings" tabindex="-1" role="dialog" aria-labelledby="configSettings">
	<div class="modal-dialog modal-sm" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">Configurações</h4>
			</div>
			
			<div class="modal-body">
				<div class="form-group">
					<label for="nomes1" class="control-label">Nomes da Tabela de Equivalência:</label>
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
			</div>
			
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
			</div>
		</div>
	</div>
</div>