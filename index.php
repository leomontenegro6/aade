<?php
require_once('utils/aade.php');
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Editor de Diálogos do Ace Attorney</title>
		<meta http-equiv="content-type" content="text/html;charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
		
		<link rel="apple-touch-icon-precomposed" sizes="57x57" href="favicons/apple-touch-icon-57x57.png" />
		<link rel="apple-touch-icon-precomposed" sizes="114x114" href="favicons/apple-touch-icon-114x114.png" />
		<link rel="apple-touch-icon-precomposed" sizes="72x72" href="favicons/apple-touch-icon-72x72.png" />
		<link rel="apple-touch-icon-precomposed" sizes="144x144" href="favicons/apple-touch-icon-144x144.png" />
		<link rel="apple-touch-icon-precomposed" sizes="60x60" href="favicons/apple-touch-icon-60x60.png" />
		<link rel="apple-touch-icon-precomposed" sizes="120x120" href="favicons/apple-touch-icon-120x120.png" />
		<link rel="apple-touch-icon-precomposed" sizes="76x76" href="favicons/apple-touch-icon-76x76.png" />
		<link rel="apple-touch-icon-precomposed" sizes="152x152" href="favicons/apple-touch-icon-152x152.png" />
		<link rel="icon" type="image/png" href="favicons/favicon-196x196.png" sizes="196x196" />
		<link rel="icon" type="image/png" href="favicons/favicon-96x96.png" sizes="96x96" />
		<link rel="icon" type="image/png" href="favicons/favicon-32x32.png" sizes="32x32" />
		<link rel="icon" type="image/png" href="favicons/favicon-16x16.png" sizes="16x16" />
		<link rel="icon" type="image/png" href="favicons/favicon-128.png" sizes="128x128" />
		<meta name="application-name" content="&nbsp;" />
		<meta name="msapplication-TileColor" content="#FFFFFF" />
		<meta name="msapplication-TileImage" content="favicons/mstile-144x144.png" />
		<meta name="msapplication-square70x70logo" content="favicons/mstile-70x70.png" />
		<meta name="msapplication-square150x150logo" content="favicons/mstile-150x150.png" />
		<meta name="msapplication-wide310x150logo" content="favicons/mstile-310x150.png" />
		<meta name="msapplication-square310x310logo" content="favicons/mstile-310x310.png" />
		
		<link rel="stylesheet" href="css/bootstrap.min.css">
		<link rel="stylesheet" href="css/dataTables.bootstrap.min.css">
		<link rel="stylesheet" href="css/jquery.highlighttextarea.min.css">
		<link rel="stylesheet" href="css/css.css?<?php echo filemtime('css/css.css') ?>">
		<script type="text/javascript" src="js/jquery-1.11.0.min.js"></script>
		<script type="text/javascript" src="js/bootstrap.min.js"></script>
		<script type="text/javascript" src="js/jquery.dataTables.min.js"></script>
		<script type="text/javascript" src="js/dataTables.bootstrap.min.js"></script>
		<script type="text/javascript" src="js/jquery.dataTables.pagination.plugin.js"></script>
		<script type="text/javascript" src="js/html2canvas.js"></script>
		<script type="text/javascript" src="js/jquery.highlighttextarea.min.js"></script>
		<script type="text/javascript" src="js/clipboard.min.js"></script>
		<script type="text/javascript" src="js/FileSaver.min.js"></script>
		<script type="text/javascript" src="js/html2rtf.js?<?php echo filemtime('js/html2rtf.js') ?>"></script>
		<script type="text/javascript" src="js/aade.js?<?php echo filemtime('js/aade.js') ?>"></script>
		<script type="text/javascript">
			$(function(){
				aade.loadEquivalenceTable('aa1');
				aade.setDefaultValuesSandboxField("Juiz", "Sua conduta durante este\njulgamento decidirá o\ndestino de seu cliente.");
			})
		</script>
	</head>
	<body>
		<nav class="navbar navbar-inverse navbar-static-top">
			<div class="container-fluid">
				<nav id="header" class="navbar-collapse">
					<ul class="nav navbar-nav title">
						<li>
							<a class="navbar-brand" href="#" style="padding-top: 0;">
								<img src="favicons/brand.png" />
							</a>
						</li>
						<li>
							<a class="navbar-brand" href="#">
								<span class="hidden-xs">
									Editor de Diálogos do Ace Attorney v0.5
								</span>
								<span class="visible-xs">
									EDAA v0.5
								</span>
							</a>
						</li>
					</ul>
					<ul class="nav navbar-nav navbar-right about">
						<li>
							<a class="navbar-brand" href="https://github.com/leomontenegro6/aade" title="Sobre este programa" target="_blank">
								<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</nav>
		<div class="container-fluid">
			
			<div id="global-actions-dropdown" class="dropdown pull-right" style="display: none">
				<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					Arquivo
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu">
					<li>
						<a href="#" onclick="aade.showScriptConfigSettings()">
							<span class="glyphicon glyphicon-cog"></span>
							Configurações
						</a>
					</li>
					<li>
						<a href="#" onclick="aade.previewScript()">
							<span class="glyphicon glyphicon-open-file"></span>
							Gerar Prévia do Script
						</a>
					</li>
					<li>
						<a href="#" onclick="aade.saveScript()">
							<span class="glyphicon glyphicon-save-file"></span>
							Salvar Script
						</a>
					</li>
					<li>
						<a href="#" onclick="aade.showScriptExportSettings()">
							<span class="glyphicon glyphicon-export"></span>
							Exportar Script
						</a>
					</li>
					<li>
						<a href="#" onclick="aade.showScriptAnalysisSettings()">
							<span class="glyphicon glyphicon-search"></span>
							Analisar Script
						</a>
					</li>
				</ul>
			</div>
			
			<ul id="main-tabs" class="nav nav-tabs" role="tablist">
				<li role="presentation" class="active">
					<a href="#dialog-parser-tab" aria-controls="dialog-parser-tab" role="tab" data-toggle="tab">
						<span class="glyphicon glyphicon-text-size"></span>
						Tradutor de Diálogos
					</a>
				</li>
				<li role="presentation">
					<a href="#equivalence-table-tab" aria-controls="equivalence-table-tab" role="tab" data-toggle="tab">
						<span class="glyphicon glyphicon-duplicate"></span>
						Tabela de Equivalência
					</a>
				</li>
				<li role="presentation">
					<a href="#sandbox-tab" aria-controls="sandbox-tab" role="tab" data-toggle="tab">
						<span class="glyphicon glyphicon-inbox"></span>
						Sandbox
					</a>
				</li>
			</ul>

			<div class="tab-content">
				<div role="tabpanel" class="tab-pane active" id="dialog-parser-tab"><?php include('dialog-file-form.php') ?></div>
				<div role="tabpanel" class="tab-pane" id="equivalence-table-tab"><?php include('equivalence-table.php') ?></div>
				<div role="tabpanel" class="tab-pane" id="sandbox-tab"><?php include('sandbox.php') ?></div>
			</div>
			
			<?php
			include('modal-loading.php');
			include('modal-analysis.php');
			include('modal-export.php');
			include('modal-config.php');
			include('modal-text-preview.php');
			?>
		</div>
		<footer class="footer">
			<div class="container">
				<?php
				$ano_criacao = '2017';
				$ano_atual = date('Y');
				if($ano_criacao == $ano_atual){
					$anos = $ano_atual;
				} else {
					$anos = $ano_criacao . ' - ' . $ano_atual;
				}
				?>
				<p class="text-muted">&copy; <?php echo $anos ?> - Solid One</p>
			</div>
		</footer>
	</body>
</html>
