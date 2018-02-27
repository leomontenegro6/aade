<form class="dialog-file-form" onsubmit="return aade.readScriptFile(this)">
	<div class="panel panel-default">
		<div class="panel-body">
			<div class="form-group">
				<label for="file-origin-input" class="control-label">Arquivo*:</label>
				<div class="row">
					<div class="col-sm-6">
						<div class="radio">
							
							<input type="radio" name="file-origin" id="file-origin-input" value="f"
								onchange="aade.toggleFileOrigin(this)" checked />
							<label for="file-origin-input" style='margin-bottom: 5px'><span></span>Fazer upload no campo abaixo</label>
							
							<input type="file" id="file-field" name="script-file" required />
						</div>
					</div>
					<div class="col-sm-6">
						<div class="radio">
							<input type="radio" name="file-origin" id="file-origin-select" value="s"
								onchange="aade.toggleFileOrigin(this)" />
							<label for="file-origin-select"><span></span>Escolher arquivo na lista abaixo</label>
							
							<br />
							<div id="file-list" style="display: none">
								<?php
								$files = glob('scripts/*.txt');
								foreach($files as $i=>$file){
									$filename = str_replace('scripts/', '', $file);
									?>
									<div class="col">
										<input type="radio" name="file-item-list" id="file-item-list-<?php echo $i ?>"
											value="<?php echo $file ?>"
											onclick="aade.selectFileFromList(this)" />
										<div class="btn-group">
											<label for="file-item-list-<?php echo $i ?>" class="btn btn-default">
												<span class="content"><?php echo $filename ?></span>
											</label>
										</div>
									</div>
									<?php
								}
								?>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-6">
					<div class="form-group">
						<label for="game-field" class="control-label">Jogo:</label>
						<div class="radio">
							<input type="radio" name="game-field" id="game-field-aa1" value="aa1"
								onchange="aade.loadEquivalenceTableFromFileForm(this.value)" checked />
							<label for="game-field-aa1"><span></span>Phoenix Wright: Ace Attorney (AA1)</label>
						</div>
						<div class="radio">
							<input type="radio" name="game-field" id="game-field-aa2" value="aa2"
								onchange="aade.loadEquivalenceTableFromFileForm(this.value)" />
							<label for="game-field-aa2"><span></span>Phoenix Wright: Ace Attorney - Justice For All (AA2)</label>
						</div>
						<div class="radio">
							<input type="radio" name="game-field" id="game-field-aa3" value="aa3"
								onchange="aade.loadEquivalenceTableFromFileForm(this.value)" />
							<label for="game-field-aa3"><span></span>Phoenix Wright: Ace Attorney - Trials and Tribulations (AA3)</label>
						</div>
					</div>
				</div>
				<div class="col-sm-6">
					<div class="form-group">
						<label for="name-type-original" class="control-label">Nomes da Tabela de Equivalência:</label>
						<div class="radio">
							<input type="radio" name="name-type" id="name-type-original" value="o"
								onchange="aade.changeDefaultNameTypes(this)" checked />
							<label for="name-type-original"><span></span>Originais</label>
						</div>
						<div class="radio">
							<input type="radio" name="name-type" id="name-type-adapted" value="a"
								onchange="aade.changeDefaultNameTypes(this)" />
							<label for="name-type-adapted"><span></span>Adaptados</label>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-6">
					<div class="form-group">
						<label for="platform-3ds" class="control-label">Plataforma:</label>
						<div class="radio">
							<input type="radio" name="platform" id="platform-3ds" value="3ds"
								onchange="aade.changePreviewPlatform(this)" checked />
							<label for="platform-3ds"><span></span>Nintendo 3DS</label>
						</div>
						<div class="radio">
							<input type="radio" name="platform" id="platform-ds-jacutemsabao" value="ds_jacutemsabao"
								onchange="aade.changePreviewPlatform(this)" />
							<label for="platform-ds-jacutemsabao"><span></span>Nintendo DS <small>(Americana - Jacutem Sabão)</small></label>
						</div>
						<div class="radio">
							<input type="radio" name="platform" id="platform-ds-american" value="ds_american"
								onchange="aade.changePreviewPlatform(this)" />
							<label for="platform-ds-american"><span></span>Nintendo DS <small>(Americana)</small></label>
						</div>
						<div class="radio">
							<input type="radio" name="platform" id="platform-ds-european" value="ds_european"
								onchange="aade.changePreviewPlatform(this)" />
							<label for="platform-ds-european"><span></span>Nintendo DS <small>(Européia)</small></label>
						</div>
					</div>
				</div>
				<div class="col-sm-6">
					<div class="form-group">
						<label for="script-format-asd" class="control-label">Formato do Script:</label>
						<div class="radio">
							<input type="radio" name="script-format" id="script-format-curly-brackets" value="b"
								onchange="aade.changeScriptFormat(this)" checked />
							<label for="script-format-curly-brackets"><span></span>Tags em {chaves} <small>(Tool do DiegoHH / Antiga tool do Onepiecefreak)</small></label>
						</div>
						<div class="radio">
							<input type="radio" name="script-format" id="script-format-crevrons" value="c"
								onchange="aade.changeScriptFormat(this)" />
							<label for="script-format-crevrons"><span></span>Tags em &lt;chevron&gt; <small>(Tool nova do Onepiecefreak)</small></label>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-6 visible-xs">
					<div class="form-group">
						<label for="mobile-show-initially-preview" class="control-label">Exibir Inicialmente¹:</label>
						<div class="radio">
							<input type="radio" name="mobile-show-initially" id="mobile-show-initially-preview" value="p"
								onchange="aade.changeMobileShowInitially(this)" checked />
							<label for="mobile-show-initially-preview"><span></span>Prévia</label>
						</div>
						<div class="radio">
							<input type="radio" name="mobile-show-initially" id="mobile-show-initially-textfield" value="t"
								onchange="aade.changeMobileShowInitially(this)" />
							<label for="mobile-show-initially-textfield"><span></span>Campo de Texto</label>
						</div>
					</div>
					<sub>1. Apenas para dispositivos de pouca largura (celulares)</sub>
				</div>
			</div>
			<p class="help-block">* Campo obrigatório</p>
			<button type="submit" class="btn btn-primary">
				<span class="glyphicon glyphicon-upload" aria-hidden="true"></span>
				Enviar
			</button>
			<div class="alert alert-info" role="alert" style="margin-top: 10px">
				Instruções:
				<ul>
					<li>
						Extraia scripts de algum dos jogos da primeira trilogia "Ace Attorney",
						gerados ou pelas tools do romhacker <i>DiegoHH</i>, ou do <i>onepiecefreak</i>;
					</li>
					<li>
						Aguarde o script terminar de ser interpretado. Geralmente leva alguns segundos;
					</li>
					<li>
						Após tê-lo carregado, aparecerão os blocos de diálogo, separados em vários
						campos de texto, seguido de uma prévia ao lado. É o sinal de que já pode
						começar a traduzir;
					</li>
					<li><b>IMPORTANTE</b>: Antes de fechar a tool, lembre-se de salvar o script clicando em "Arquivo -> Salvar Script"¹</li>
				</ul>

				<sub>
					1. Essa tool atualmente não realiza a persistência de nada submetido a ela,
					logo cabe ao usuário upar e salvar os scripts periodicamente, enquanto traduz por ela.
					Se o script não for salvo, ele será perdido.
				</sub>
			</div>
		</div>
	</div>
</form>