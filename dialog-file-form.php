<form class="dialog-file-form" onsubmit="return aade.readScriptFile(this)">
	<div class="panel panel-default">
		<div class="panel-body">
			<div class="form-group">
				<label for="file-field" class="control-label">Arquivo*:</label>
				<input type="file" id="file-field" name="script-file" required />
			</div>
			<div class="form-group">
					<label for="nomes1" class="control-label">Nomes da Tabela de Equivalência:</label>
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