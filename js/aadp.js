/* Javascript library containing methods related to Ace Attorney Dialogue Previewer
 * 
 */

function aadp(){
	
	// Properties
	//this.prop = 0;
	
	// Methods
	this.updatePreview = function(field, previewFieldId, textType){
		if(typeof textType == 'undefined') textType == 't';
		
		var $field = $(field);
		var $divPreview = $('#' + previewFieldId);
		
		var text = $field.val();
		var tag = false;
		
		if(textType == 'p'){
			var $divCharacterName = $divPreview.children('div.character-name');
			$divCharacterName.html(text);
		} else if(textType == 't'){
			var $divTextWindow = $divPreview.children('div.text-window');
			$divTextWindow.html('');
			
			for (var i = 0, size = text.length; i < size; i++) {
				var char = text[i];
				
				if(char == '\n'){
					$divTextWindow.append('<br />');
					continue;
				}
				
				if(char == "{"){
					tag = true;
				} else if(char == "}"){
					char = '';
					tag = false;
				} else {
					char = this.formatChar(char);
				}
				
				if(!tag && char != ''){
					$divTextWindow.append(
						$('<span />').addClass('letter ' + char).html('&nbsp;')
					);
				}
			}
		}
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
			'_': 'underscore', '´': 'acute-accent', '¡': 'inverted-exclamation',
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
var aadp = new aadp();
