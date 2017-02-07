<div class="row">
	<div class="col-xs-12">
		<div class="panel panel-default">
			<div class="panel-body">
				<div class="form-group">
					<label for="sandbox-field" class="control-label">Personagem:</label>
					<input type="text" id="sandbox-character-field" class="form-control" onkeyup="aadp.updatePreview(this, 'sandbox-preview', 'p')" />
				</div>
				<div class="form-group">
					<label for="sandbox-text-field" class="control-label">Texto:</label>
					<textarea id="sandbox-text-field" class="form-control" rows="3" onkeyup="aadp.updatePreview(this, 'sandbox-preview', 't')"></textarea>
				</div>
				<button type="button" class="btn btn-primary"
					onclick="aadp.renderImageOnBrowser('sandbox-character-field', 'sandbox-text-field', 'sandbox-preview')">
					<span class="glyphicon glyphicon-picture"></span>
					Gerar Imagem
				</button>
			</div>
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3 class="panel-title">Prévia</h3>
				</div>
				<div class="panel-body">
					<div id="sandbox-preview">
						<div class="character-name"></div>
						<div class="text-window"></div>
					</div>
					<br />
					<img src="img/background1_preenchido.png" />
				</div>
			</div>
		</div>
	</div>
</div>
