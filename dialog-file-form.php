<form class="dialog-file-form" onsubmit="return aade.readScriptFile(this)">
	<div class="panel panel-default">
		<div class="panel-body">
			<div class="form-group">
				<label for="file-origin-input" class="control-label">Arquivo*:</label>
				<div class="row">
					<div class="col-sm-6">
						<div class="radio">
							<label>
								<input type="radio" name="file-origin" id="file-origin-input" value="f"
									onchange="aade.toggleFileOrigin(this)" checked />
								Fazer upload no campo abaixo
							</label>
							<input type="file" id="file-field" name="script-file" required />
						</div>
					</div>
					<div class="col-sm-6">
						<div class="radio">
							<label>
								<input type="radio" name="file-origin" id="file-origin-select" value="s"
									onchange="aade.toggleFileOrigin(this)" />
								Escolher arquivo na lista abaixo
							</label>
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
						<label for="platform-3ds" class="control-label">Plataforma:</label>
						<div class="radio">
							<label>
								<input type="radio" name="platform" id="platform-3ds" value="3ds"
									onchange="aade.changePreviewPlatform(this)" checked />
								Nintendo 3DS
							</label>
						</div>
						<div class="radio">
							<label>
								<input type="radio" name="platform" id="platform-ds-jacutemsabao" value="ds_jacutemsabao"
									onchange="aade.changePreviewPlatform(this)" />
								Nintendo DS
								<small>(Americana - Jacutem Sabão)</small>
							</label>
						</div>
						<div class="radio">
							<label>
								<input type="radio" name="platform" id="platform-ds-american" value="ds_american"
									onchange="aade.changePreviewPlatform(this)" />
								Nintendo DS
								<small>(Americana)</small>
							</label>
						</div>
						<div class="radio">
							<label>
								<input type="radio" name="platform" id="platform-ds-european" value="ds_european"
									onchange="aade.changePreviewPlatform(this)" />
								Nintendo DS
								<small>(Européia)</small>
							</label>
						</div>
					</div>
				</div>
				<div class="col-sm-6">
					<div class="form-group">
						<label for="name-type-original" class="control-label">Nomes da Tabela de Equivalência:</label>
						<div class="radio">
							<label>
								<input type="radio" name="name-type" id="name-type-original" value="o"
									onchange="aade.changeDefaultNameTypes(this)" checked />
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
						gerados pelas tools do romhacker <i>onepiecefreak</i>;
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