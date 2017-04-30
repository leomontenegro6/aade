/* Javascript library containing methods related to Ace Attorney Dialogue Editor
 * 
 */

function aade(){
	
	// Properties
	this.lastName = '???';
	this.lastColor = '';
	
	// Methods
	this.readScriptFile = function(field){
		var $dialogParserTab = $('#dialog-parser-tab');
		
		var ajax = new XMLHttpRequest();
		ajax.open("POST", "dialog-parser.php", true);
		
		var formData = new FormData();
		formData.append('script-file', field.files[0]);
		
		this.showLoadingIndicator();
		
		var that = this;
		ajax.onreadystatechange = function(){
			if (ajax.readyState == 4 && ajax.status == 200) {
				var response = ajax.responseText;
				$dialogParserTab.html(response);
				
				that.instantiatePaginationDialogParsing();
				
				that.hideLoadingIndicator();
			}
		}
		
		var x = ajax.send(formData);
	}
	
	this.instantiatePaginationDialogParsing = function(){
		var $dialogParserTable = $('#dialog-parser-table');
		
		if($dialogParserTable.length == 0){
			return;
		}
		
		// Instantiation
		var that = this;
		var object = $dialogParserTable.on('draw.dt', function(){
			// Ondraw event
			var $tbody = $dialogParserTable.children('tbody');
			$tbody.children('tr').each(function(){
				var $tr = $(this);
				var $textareaTextField = $tr.find('textarea.text-field');
				var $divDialogPreview = $tr.find('div.dialog-preview');
				var $buttonCopyClipboard = $tr.find('button.copy-clipboard');
				
				var previewFieldId = $divDialogPreview.attr('id');
				
				that.updatePreview($textareaTextField, previewFieldId, 't', false);
				that.instantiateCopyClipboardButton($buttonCopyClipboard[0], $textareaTextField);
			});
			
			var $textareas = $tbody.find('textarea.text-field');
			that.highlightWordsTextareas($textareas);
		}).DataTable({
			'ordering': false,
			'autoWidth': true,
			'lengthMenu': [1, 2, 3, 5, 7, 10, 15],
			'pageLength': 5,
			'order': [],
			'language': {
				'sEmptyTable': 'Nenhum registro encontrado',
				'sInfo': '',
				'sInfoEmpty': '(Sem resultados)',
				'sInfoFiltered': '',
				'sInfoPostFix': '',
				'sInfoThousands': '.',
				'sLengthMenu': 'Exibir: _MENU_',
				'sLoadingRecords': 'Carregando...<br />Por favor, aguarde!',
				'sProcessing': 'Processando...<br />Por favor, aguarde!',
				'sZeroRecords': 'Nenhum registro encontrado',
				'sSearch': 'Pesquisar:',
				'oPaginate': {
					'sFirst': '<span class="glyphicon glyphicon-step-backward"></span>',
					'sPrevious': '<span class="glyphicon glyphicon-backward"></span>',
					'sNext': '<span class="glyphicon glyphicon-forward"></span>',
					'sLast': '<span class="glyphicon glyphicon-step-forward"></span>'
				},
				'oAria': {
					'sSortAscending': ': Ordenar colunas de forma ascendente',
					'sSortDescending': ': Ordenar colunas de forma descendente'
				}
			}
		});
	}
	
	this.highlightWordsTextareas = function(textareas){
		var $textareas = $(textareas);
		var $equivalenceTable = $('#equivalence-table')
		var $inputsAdaptedNames = $equivalenceTable.find('input.adapted-name');
		
		var names = [];
		$inputsAdaptedNames.each(function(){
			names.push(this.value);
		});
		
		$textareas.highlightTextarea({
			'words': [{
				'color': 'lightsalmon',
				'words': ['{(.+?)}']
			}, {
				'color': 'khaki',
				'words': names
			}]
		});
	}
	
	this.instantiateCopyClipboardButton = function(button, textarea){
		var $textarea = $(textarea);
		var $button = $(button);
		
		var texto = $textarea.val();
		texto = texto.replace(/{(.*?)}/g, '').replace(/\n/g, ' ');
		
		$button.attr('data-clipboard-text', texto).popover({
			'title': '',
			'content': 'Copiado com sucesso',
			'placement': 'left'
		});
		
		var clipboard = new Clipboard(button);
		
		clipboard.on('success', function(e) {
			$button.popover('show');
			setTimeout(function(){
				$button.popover('hide');
			}, 3000);
		});
	}
	
	this.updatePreview = function(field, previewFieldId, textType, sandbox){
		if(typeof textType == 'undefined') textType = 't';
		if(typeof sandbox == 'undefined') sandbox = true;
		
		var $field = $(field);
		var $divPreview = $('#' + previewFieldId);
		
		var text = $field.val();
		var tag = false;
		var hasNameTag = false;
		var tagText = '';
		
		if(textType == 'c'){
			var $divCharacterName = $divPreview.children('div.character-name');
			$divCharacterName.html(text);
		} else if(textType == 't'){
			var $divTextWindow = $divPreview.children('div.text-window');
			var $divCharacterName = $divPreview.children('div.character-name');
			$divTextWindow.html('');
			
			for (var i = 0, size = text.length; i < size; i++) {
				var char = text[i];
				
				if(sandbox && char == '\n'){
					$divTextWindow.append('<br />');
					continue;
				}
				
				if(char == "{"){
					tag = true;
				} else if(char == "}"){
					tag = false;
				}
				
				if(tag){
					if(char != '{'){
						tagText += char;
					}
				} else {
					// Tags for all contexts
					if(tagText == 'b'){
						$divTextWindow.append('<br />');
					} else if(char != '}' && char != '\n'){
						var newChar = this.formatChar(char);

						$divTextWindow.append(
							$('<span />').addClass('letter ' + newChar + ' ' + this.lastColor).html('&nbsp;')
						);
					} else if(!sandbox){
						// Specific tags for dialog parsing
						if(tagText.startsWith('name:')){
							hasNameTag = true;

							var tmp = tagText.split(':');
							var characterCode = parseInt(tmp.pop(), 10);
							this.lastName = this.getName(characterCode, true);
						} else if(tagText.startsWith('color:')){
							var tmp = tagText.split(':');
							var colorCode = parseInt(tmp.pop(), 10);
							if(colorCode == 1){
								this.lastColor = 'color-orange';
							} else if(colorCode == 2){
								this.lastColor = 'color-blue';
							} else if(colorCode == 3){
								this.lastColor = 'color-green';
							} else {
								this.lastColor = '';
							}
						} else if(tagText.startsWith('center_text:')){
							var tmp = tagText.split(':');
							var centerCode = parseInt(tmp.pop(), 10);
							if(centerCode == 1){
								$divTextWindow.addClass('centered');
							} else {
								$divTextWindow.removeClass('centered');
							}
						}
					}
					tagText = '';
				}
			}
			
			if(!sandbox){
				if(!hasNameTag){
					var code_server = $divCharacterName.attr('data-character-code');
					this.lastName = this.getName(code_server, true);
				}
				
				$divCharacterName.html(this.lastName);
			}
		}
	}
	
	this.getName = function(code, adapted){
		if(typeof adapted == 'undefined') adapted = false;
		
		var $equivalenceTable = $('#equivalence-table');
		var $tbodyEquivalenceTable = $equivalenceTable.children('tbody');
		var $inputName;
		if(adapted){
			$inputName = $tbodyEquivalenceTable.find("[name='character[" + code + "][adapted_name]']");
		} else {
			$inputName = $tbodyEquivalenceTable.find("[name='character[" + code + "][original_name]']");
		}
		
		if($inputName.length > 0){
			return $inputName.val();
		} else {
			return '???';
		}
	}
	
	this.generateScript = function(){
		var $dialogParserForm = $('#dialog-parser-form');
		var $dialogParserTable = $('#dialog-parser-table');
		
		var tableObject = $dialogParserTable.DataTable();
		var that = this;
		that.showLoadingIndicator();
		
		setTimeout(function(){
			$( tableObject.rows().nodes() ).find('textarea').each(function(){
				var $textarea = $(this);

				$textarea.clone().appendTo( $dialogParserForm );
			});
			$dialogParserForm.submit().children('textarea').remove();
			that.hideLoadingIndicator();
		}, 500);
	}
	
	this.showLoadingIndicator = function(){
		$('#loading-indicator').modal('show');
	}
	
	this.hideLoadingIndicator = function(){
		$('#loading-indicator').modal('hide');
	}
	
	this.updateBackgroundsSandbox = function(field){
		var $field = $(field);
		var $divSandboxPreview = $('#sandbox');
		var $imgComparativeImage = $('#sandbox-comparative-image');
		
		var value = $field.val();
		$divSandboxPreview.css('background', "url('images/" + value + ".png')");
		$imgComparativeImage.attr('src', 'images/' + value + '_filled.png');
	}
	
	this.formatChar = function(char){
		var charTable = {
			// Symbols
			' ': 'space', '!': 'exclamation', '"': 'double-quotes', '#': 'cerquilha',
			'$': 'money-sign', '%': 'percent', '&': 'ampersand', "'": 'quotes',
			"(": 'open-parenthesis', ")": 'close-parenthesis', '*': 'asterisk',
			'+': 'plus', ',': 'comma', '-': 'minus', '.': 'dot', '/': 'slash',
			':': 'colon', ';': 'semicolon', '<': 'less-than', '=': 'equal',
			'>': 'greater-than', '?': 'interrogation', '©': 'copyright',
			'[': 'open-square-brackets', ']': 'close-square-brackets',
			'_': 'underscore', '¡': 'inverted-exclamation',
			'¿': 'inverted-interrogation', 'º': 'o-ordinal', 'ª': 'a-ordinal',
			
			// Numbers
			'0': 'n0', '1': 'n1', '2': 'n2', '3': 'n3', '4': 'n4', '5': 'n5',
			'6': 'n6', '7': 'n7', '8': 'n8', '9': 'n9',
			
			// Uppercase accents
			'À': 'A-grave', 'Á': 'A-acute', 'Â': 'A-circumflex', 'Ã': 'A-tilde',
			'Ä': 'A-diaeresis', 'Ç': 'C-cedilla', 'È': 'E-grave', 'É': 'E-acute', 
			'Ê': 'E-circumflex', 'Ë': 'E-diaeresis', 'Ẽ': 'E-tilde', 'Ì': 'I-grave',
			'Í': 'I-acute', 'Ï': 'I-diaeresis', 'Î': 'I-circumflex', 'Ò': 'O-grave',
			'Ó': 'O-acute', 'Ô': 'O-circumflex', 'Õ': 'O-tilde', 'Ö': 'O-diaeresis',
			'Ù': 'U-grave', 'Ú': 'U-acute', 'Û': 'U-circumflex', 'Ü': 'U-diaeresis',
			'Ñ': 'N-circumflex', 'Ÿ': 'Y-diaeresis',
			
			// Lowercase accents
			'à': 'a-grave', 'á': 'a-acute', 'â': 'a-circumflex', 'ã': 'a-tilde',
			'ä': 'a-diaeresis', 'ç': 'c-cedilla', 'è': 'e-grave', 'é': 'e-acute', 
			'ê': 'e-circumflex', 'ẽ': 'e-tilde', 'ë': 'e-diaeresis', 'ì': 'i-grave',
			'í': 'i-acute', 'ï': 'i-diaeresis', 'î': 'i-circumflex', 'ò': 'o-grave',
			'ó': 'o-acute', 'ô': 'o-circumflex', 'õ': 'o-tilde', 'ö': 'o-diaeresis',
			'ù': 'u-grave', 'ú': 'u-acute', 'û': 'u-circumflex', 'ü': 'u-diaeresis',
			'ñ': 'n-circumflex', 'ÿ': 'y-diaeresis'
			
		}
		
		var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
		for(var i in alphabet){
			var letter = alphabet[i];
			
			charTable[letter] = letter;
		}
		
		var key, newChar;
		for (key in charTable) {
			if(key == char){
				var newValue = charTable[key];
				newChar = char.replace(key, newValue);
				break;
			}
		}
		if(typeof newChar == 'string'){
			return newChar;
		} else {
			return 'unknown';
		}
	}
	
	this.setDefaultValuesSandboxField = function(character, text){
		var $characterField = $('#sandbox-character-field');
		var $textField = $('#sandbox-text-field');
		
		$characterField.val(character).trigger('keyup');
		$textField.val(text).trigger('keyup');
	}
	
	this.renderImageOnBrowser = function(characterFieldId, textFieldId, previewFieldId, callback){
		var $characterField = $('#' + characterFieldId);
		var $textField = $('#' + textFieldId);
		var $previewField = $('#' + previewFieldId);
		
		var filename = ( $characterField.val() + '-' + $textField.val() ).replace(/\n/g, ' ');
		
		html2canvas($previewField, {
			onrendered: function(canvas) {
				var a = document.createElement('a');
				a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
				a.download = filename + '.png';
				var $a = $(a);
				$('body').append($a);
				a.click();
				$a.remove();
				
				if(callback) callback();
			}
		});
	}
}

// Instantiating objct for class above
var aade = new aade();
