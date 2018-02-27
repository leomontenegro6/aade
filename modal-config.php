<div class="modal" id="config-settings" tabindex="-1" role="dialog" aria-labelledby="configSettings">
	<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">Configurações</h4>
			</div>
			
			<div class="modal-body">
				<div class="row">
					<div class="col-sm-6">
						<div class="form-group">
							<label for="config-game-field-aa1" class="control-label">Jogo:</label>
							<div class="radio">
								<div class="radio">
									<input type="radio" name="config-game-field" id="config-game-field-aa1" value="aa1"
										onchange="aade.loadEquivalenceTableFromFileForm(this.value)" />
									<label for="config-game-field-aa1"><span></span>Phoenix Wright: Ace Attorney (AA1)</label>
								</div>
								<div class="radio">
									<input type="radio" name="config-game-field" id="config-game-field-aa2" value="aa2"
										onchange="aade.loadEquivalenceTableFromFileForm(this.value)" />
									<label for="config-game-field-aa2"><span></span>Phoenix Wright: Ace Attorney - Justice For All (AA2)</label>
								</div>
								<div class="radio">
									<input type="radio" name="config-game-field" id="config-game-field-aa3" value="aa3"
										onchange="aade.loadEquivalenceTableFromFileForm(this.value)" />
									<label for="config-game-field-aa3"><span></span>Phoenix Wright: Ace Attorney - Trials and Tribulations (AA3)</label>
								</div>
							</div>
						</div>
					</div>
					<div class="col-sm-6">
						<div class="form-group">
							<label for="config-name-type-original" class="control-label">Nomes da Tabela de Equivalência:</label>
							<div class="radio">
								<input type="radio" name="config-name-type" id="config-name-type-original" value="o"
									onchange="aade.changeDefaultNameTypes(this)" />
								<label for="config-name-type-original"><span></span>Originais</label>
							</div>
							<div class="radio">
								<input type="radio" name="config-name-type" id="config-name-type-adapted" value="a"
									onchange="aade.changeDefaultNameTypes(this)" />
								<label for="config-name-type-adapted"><span></span>Adaptados</label>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-sm-6">
						<div class="form-group">
							<label for="config-platform-3ds" class="control-label">Plataforma:</label>
							<div class="radio">
								<input type="radio" name="config-platform" id="config-platform-3ds" value="3ds"
									onchange="aade.changePreviewPlatform(this)" />
								<label for="config-platform-3ds"><span></span>Nintendo 3DS</label>
							</div>
							<div class="radio">
								<input type="radio" name="config-platform" id="config-platform-ds-jacutemsabao" value="ds_jacutemsabao"
									onchange="aade.changePreviewPlatform(this)" />
								<label for="config-platform-ds-jacutemsabao"><span></span>Nintendo DS <small>(Americana - Jacutem Sabão)</small></label>
							</div>
							<div class="radio">
								<input type="radio" name="config-platform" id="config-platform-ds-american" value="ds_american"
									onchange="aade.changePreviewPlatform(this)" />
								<label for="config-platform-ds-american"><span></span>Nintendo DS <small>(Americana)</small></label>
							</div>
							<div class="radio">
								<input type="radio" name="config-platform" id="config-platform-ds-european" value="ds_european"
									onchange="aade.changePreviewPlatform(this)" />
								<label for="config-platform-ds-european"><span></span>Nintendo DS <small>(Européia)</small></label>
							</div>
						</div>
					</div>
					<div class="col-sm-6">
						<div class="form-group">
							<label for="config-theme-light" class="control-label">Tema:</label>
							<div class="radio">
								<div class="radio">
									<input type="radio" name="config-theme" id="config-theme-light" value="light"
										onchange="aade.changeTheme(this)" />
									<label for="config-theme-light"><span></span>Claro</label>
								</div>
								<div class="radio">
									<input type="radio" name="config-theme" id="config-theme-dark" value="dark"
										onchange="aade.changeTheme(this)" />
									<label for="config-theme-dark"><span></span>Escuro</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-sm-6">
						<div class="form-group">
							<label for="invalidate-large-lines-true" class="control-label">Invalidar Linhas Largas¹:</label>
							<div class="radio">
								<input type="radio" name="invalidate-large-lines" id="invalidate-large-lines-true" value="true"
									onchange="aade.toggleLargeLinesInvalidation(this)" />
								<label for="invalidate-large-lines-true"><span></span>Sim</label>
							</div>
							<div class="radio">
								<input type="radio" name="invalidate-large-lines" id="invalidate-large-lines-false" value="false"
									onchange="aade.toggleLargeLinesInvalidation(this)" />
								<label for="invalidate-large-lines-false"><span></span>Não</label>
							</div>
						</div>
						<sub>
							1. Se ativado, blocos contendo mais de 32 linhas serão
							considerados inválidos na prévia, e na função de analisar
							script.
						</sub>
					</div>
					<div class="col-sm-6 visible-xs">
						<div class="form-group">
							<label for="config-mobile-show-initially-preview" class="control-label">Exibir Inicialmente²:</label>
							<div class="radio">
								<input type="radio" name="config-mobile-show-initially" id="config-mobile-show-initially-preview" value="p"
									onchange="aade.changeMobileShowInitially(this)" checked />
								<label for="config-mobile-show-initially-preview"><span></span>Prévia</label>
							</div>
							<div class="radio">
								<input type="radio" name="config-mobile-show-initially" id="config-mobile-show-initially-textfield" value="t"
									onchange="aade.changeMobileShowInitially(this)" />
								<label for="config-mobile-show-initially-textfield"><span></span>Campo de Texto</label>
							</div>
						</div>
						<sub class="visible-xs">2. Apenas para dispositivos de pouca largura (celulares)</sub>
					</div>
				</div>
			</div>
			
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
			</div>
		</div>
	</div>
</div>