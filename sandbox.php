<?php
$images = array(
	'judge'=>'Juíz',
	'phoenix_objecting'=>'Veríssimo protestando',
	'miles_argumenting'=>'Spada argumentando',
	'alphabet_test'=>'Teste de alfabetos',
	'accent_test'=>'Teste de acentos'
);
?>
<div class="row">
	<div class="col-xs-12">
		<div class="panel panel-default">
			<div class="panel-body">
				<div class="form-group">
					<label for="sandbox-field" class="control-label">Personagem:</label>
					<input type="text" id="sandbox-character-field" class="form-control" onkeyup="aadp.updatePreview(this, 'sandbox-preview', 'c')" />
				</div>
				<div class="form-group">
					<label for="sandbox-text-field" class="control-label">Texto:</label>
					<textarea id="sandbox-text-field" class="form-control" rows="3" onkeyup="aadp.updatePreview(this, 'sandbox-preview', 't')"></textarea>
				</div>
				<div class="form-group">
					<label for="sandbox-background-field" class="control-label">Plano de Fundo:</label>
					<select id="sandbox-background-field" class="form-control" onchange="aadp.updateBackgrounds(this)">
						<?php foreach($images as $image=>$name){ ?>
							<option value="<?php echo $image ?>"><?php echo $name ?></option>
						<?php } ?>
					</select>
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
					<img id="sandbox-comparative-image" src="img/judge_filled.png" />
				</div>
			</div>
		</div>
	</div>
</div>
