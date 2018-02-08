/* Javascript library containing methods related to Ace Attorney Dialogue Editor
 * 
 */

function aade(){
	
	// Properties
	this.platform = '3ds';
	this.nameType = 'o';
	this.mobileShowInitially = 'p';
	this.invalidateLargeLines = true;
	this.lastName = '???';
	this.lastColor = '';
	this.equivalenceTable = {};
	this.dialogParserTableTextareas = $();
	
	// Methods
	this.readScriptFile = function(dialogFileForm){
		var $dialogFileForm = $(dialogFileForm);
		var $radioFileOrigin = $("[name='file-origin']:checked");
		var $inputFileField = $('#file-field');
		var $radioFileItemList = $("[name='file-item-list']:checked");
		var $dialogParserTab = $('#dialog-parser-tab');
		
		var file_origin = $radioFileOrigin.val();
		var file_item_list = $radioFileItemList.val();
		
		var ajax = new XMLHttpRequest();
		ajax.open("POST", "dialog-parser.php", true);
		
		var formData = new FormData();
		formData.append('file-origin', file_origin);
		if(file_origin == 'f'){
			formData.append('script-file', $inputFileField[0].files[0]);
		} else {
			formData.append('file-item-list', file_item_list);
		}
		
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
		
		ajax.send(formData);
		
		return false;
	}
	
	this.instantiatePaginationDialogParsing = function(){
		var $dialogParserTable = $('#dialog-parser-table');
		
		if($dialogParserTable.length == 0){
			return;
		}
		
		var confirmLengthySearch = false;
		var limitRows = 5;
		var originalPage = 0;
		var originalLimitRows = limitRows;
		
		// Instantiation
		var that = this;
		var object = $dialogParserTable.on({
			// Table draw event
			'draw.dt': function(){
				var device = that.getDevice();
				var mobileShowInitially = that.mobileShowInitially;
				
				// Saving selector with all textareas in an property, in order to
				// accessing it faster afterwards
				if(that.dialogParserTableTextareas.length == 0){
					var tableObject = $dialogParserTable.DataTable();
					that.dialogParserTableTextareas = $( tableObject.rows().nodes() ).find("textarea.text-field");
				}
				
				// Iterating over each visible row, instantiate "copy to clipboard"
				// buttons and update the preview
				var $tbody = $dialogParserTable.children('tbody');
				$tbody.children('tr').each(function(){
					var $tr = $(this);
					var $textareaTextField = $tr.find('textarea.text-field');
					var $divDialogPreview = $tr.find('div.dialog-preview');
					var $tdFormFields = $tr.children('td.form-fields');
					var $tdPreviewConteiners = $tr.children('td.preview-conteiners');
					var $buttonShowPreviewMobile = $tr.find('button.show-preview-mobile');
					var $buttonShowTextfieldMobile = $tr.find('button.show-textfield-mobile');
					var $buttonsCopyClipboard = $tr.find('button.copy-clipboard');

					var previewFieldId = $divDialogPreview.attr('id');

					that.updatePreview($textareaTextField, previewFieldId, 't', false);
					that.instantiateCopyClipboardButtons($buttonsCopyClipboard, $textareaTextField);
					
					if(device == 'xs'){
						if(mobileShowInitially == 'p' && $tdPreviewConteiners.hasClass('hidden-xs')){
							$buttonShowTextfieldMobile.trigger('click');
						} else if(mobileShowInitially == 't' && $tdFormFields.hasClass('hidden-xs')){
							$buttonShowPreviewMobile.trigger('click');
						}
					} else {
						$tdFormFields.add($tdPreviewConteiners).removeClass('hidden-xs visible-xs');
					}
				});
				
				// Instantiating word highlighting on all visible textareas
				var $visibleTextareas = $tbody.find('textarea.text-field');
				that.highlightWordsTextareas($visibleTextareas);
			},
			// Pagination change event
			'page.dt': function(){
				var info = object.page.info();
				var currentPage = (info.page + 1);
				var previousPage;
				if($dialogParserTable.is("[data-current-page]")){
					previousPage = parseInt($dialogParserTable.attr('data-current-page'), 10);
				} else {
					previousPage = currentPage;
				}
				$dialogParserTable.attr('data-current-page', currentPage);
				
				if(currentPage < previousPage){
					that.lastColor = '';
				}
				
				// Scrolling to top of page
				$('html, body').animate({
					scrollTop: $(".dataTables_wrapper").offset().top
				}, 'slow');
			},
			// Length change event ("Show" field)
			'length.dt': function(e, s){
				var $dialogParserTableWrapper = $dialogParserTable.closest('div.dataTables_wrapper');
				var $lengthField = $dialogParserTableWrapper.find('div.dataTables_length select');
				
				var length = s._iDisplayLength;
				var totalRows = object.data().length;
				
				// If user is trying to show all rows, and current script
				// has more than 500 rows, ask confirmation from user first.
				if(length == -1 && totalRows > 500 && !confirmLengthySearch){
					var confirm_message = "Esta pesquisa retornará muitos blocos e pode demorar um pouco.\n\n";
					confirm_message += 'Existe inclusive a possibilidade do seu navegador ficar congelado por alguns minutos, ';
					confirm_message += "dependendo da potência do seu computador, e/ou da quantidade de blocos desse script.\n\n";
					confirm_message += 'Deseja continuar?';
					var r = confirm(confirm_message);
					
					confirmLengthySearch = false;
					s._iDisplayStart = originalPage;
					s._iDisplayLength = originalLimitRows;
					
					if(r == true){
						confirmLengthySearch = true;
						originalPage = s._iDisplayStart;
						originalLimitRows = length;
						
						// Showing all rows, between a loading indicator
						that.showLoadingIndicator();
						setTimeout(function(){
							object.page.len(-1).draw();
							that.hideLoadingIndicator();
						}, 250);
					} else {
						setTimeout(function(){
							$lengthField.val(originalLimitRows);
						}, 250);
					}
				} else {
					originalLimitRows = length;
				}
			}
		}).DataTable({
			'order': [[0, 'asc']],
			'autoWidth': false,
			'lengthMenu': [
				[1, 2, 3, 5, 7, 10, 15, 25, 50, 75, 100, 150, 200, 300, 400, 500, -1],
				[1, 2, 3, 5, 7, 10, 15, 25, 50, 75, 100, 150, 200, 300, 400, 500, 'Todos']
			],
			'pageLength': 5,
			'pagingType': 'input',
			"dom":  "<'row'<'col-sm-5'lf><'col-sm-7 paginate_col'p>>" +
					"<'row'<'col-sm-12'tr>>" +
					"<'row'<'col-sm-5'i><'col-sm-7 paginate_col'p>>",
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
		
		// Showing global actions menu
		var $dropdownGlobalActions = $('#global-actions-dropdown');
		$dropdownGlobalActions.show();
		
		// Adding tab events to toggle global actions when you enter / exit
		// tbe dialog parser tab
		var $ulMainTabs = $('#main-tabs');
		var $anchors = $ulMainTabs.children('li').children('a');
		$anchors.on({
			'show.bs.tab': function(){
				var $a = $(this);
				var href = $a.attr('href');
				
				if(href == '#dialog-parser-tab'){
					$dropdownGlobalActions.show();
				} else {
					$dropdownGlobalActions.hide();
				}
			}
		});
		
		// Asking user to save script before exiting
		$(window).on("beforeunload", function() { 
			return 'Há um arquivo aberto na aba "Tradutor de Diálogos". É recomendável salvá-lo antes de sair.\nTem certeza que quer continuar?'; 
		});
	}
	
	this.instantiateEventMobileToggleFieldPreview = function(){
		var that = this;
		$(window).on('resize.mobileToggleFieldPreview', function () {
			var $dialogParserTable = $('#dialog-parser-table');
			var $tbody = $dialogParserTable.children('tbody');
			
			var device = aade.getDevice();
			var tableObject = $dialogParserTable.DataTable();
			var mobileShowInitially = that.mobileShowInitially;
			var checkUpdateTable = false;
			
			$tbody.children('tr').each(function(){
				var $tr = $(this);
				var $tdFormFields = $tr.children('td.form-fields');
				var $tdPreviewConteiners = $tr.children('td.preview-conteiners');
				var $buttonShowPreviewMobile = $tr.find('button.show-preview-mobile');
				var $buttonShowTextfieldMobile = $tr.find('button.show-textfield-mobile');
				
				if(device == 'xs'){
					if(mobileShowInitially == 'p'){
						$buttonShowTextfieldMobile.trigger('click');
						checkUpdateTable = true;
					} else if(mobileShowInitially == 't'){
						$buttonShowPreviewMobile.trigger('click');
						checkUpdateTable = true;
					}
				} else {
					if($tdFormFields.hasClass('hidden-xs')){
						$tdFormFields.removeClass('hidden-xs');
						checkUpdateTable = true;
					}
					if($tdPreviewConteiners.hasClass('hidden-xs')){
						$tdPreviewConteiners.removeClass('hidden-xs');
						checkUpdateTable = true;
					}
					if($tdFormFields.hasClass('visible-xs')){
						$tdFormFields.removeClass('visible-xs');
						checkUpdateTable = true;
					}
					if($tdPreviewConteiners.hasClass('visible-xs')){
						$tdPreviewConteiners.removeClass('visible-xs');
						checkUpdateTable = true;
					}	
				}
			});
			
			if(checkUpdateTable) tableObject.draw(false);
		});
	}
	
	this.highlightWordsTextareas = function(textareas){
		var $textareas = $(textareas);
		var $equivalenceTable = $('#equivalence-table');
		var $inputsOriginalNames = $equivalenceTable.find('input.original-name');
		var $inputsAdaptedNames = $equivalenceTable.find('input.adapted-name');
		
		var originalNames = [], adaptedNames = [];
		$inputsOriginalNames.each(function(){
			originalNames.push(this.value);
		});
		$inputsAdaptedNames.each(function(){
			adaptedNames.push(this.value);
		});
		
		$textareas.each(function(){
			var $textarea = $(this);
			var $tdFormFields = $textarea.closest('td.form-fields');
			
			if($textarea.is("[data-highlight-instantiated='true']")){
				$textarea.appendTo($tdFormFields);
				$tdFormFields.find('div.highlightTextarea').remove();
				delete $textarea.data()['highlighter'];
			}
			
			$textarea.highlightTextarea({
				'words': [{
					'color': 'lightsalmon',
					'words': ['{(.+?)}']
				}, {
					'color': 'lightgreen',
					'words': originalNames
				}, {
					'color': 'khaki',
					'words': adaptedNames
				}, {
					'color': 'aquamarine',
					'words': ['{b}']
				}, {
					'color': '#aaa',
					'words': ['{endjmp}']
				}, {
					'color': 'lightblue',
					'words': ['{wait: [0-9]*}']
				}]
			}).attr('data-highlight-instantiated', 'true');
		});
	}
	
	this.instantiateCopyClipboardButtons = function(buttons, textarea){
		var $buttons = $(buttons);
		var $textarea = $(textarea);
		
		$buttons.each(function(){
			var $button = $(this);
			
			$button.tooltip({
				'trigger': 'click',
				'placement': 'top'
			});

			var clipboard = new Clipboard(this, {
				'text': function(){
					var text = $textarea.val();
					text = $.trim( text.replace(/{(.*?)}/g, '').replace(/\n/g, ' ') );
					return text;
				}
			});

			clipboard.on('success', function(e) {
				$button.attr('data-original-title', 'Copiado para a área de transferência').tooltip('show');
				setTimeout(function(){
					$button.tooltip('hide');
				}, 3000);
			});
		})
	}
	
	this.showPreviewOnMobile = function(button){
		var $button = $(button);
		var $tr = $button.closest('tr');
		var $tdFormFields = $tr.find('td.form-fields');
		var $tdPreviewConteiners = $tr.find('td.preview-conteiners');
		var $textarea = $tdFormFields.find('textarea');
		
		if($tdPreviewConteiners.hasClass('visible-xs')){
			$tdFormFields.removeClass('hidden-xs').addClass('visible-xs');
			$tdPreviewConteiners.removeClass('visible-xs').addClass('hidden-xs');
		} else {
			$tdFormFields.removeClass('visible-xs').addClass('hidden-xs');
			$tdPreviewConteiners.removeClass('hidden-xs').addClass('visible-xs');
		}
		
		$textarea.trigger('keyup');
	}
	
	this.updatePreview = function(field, previewFieldId, textType, sandbox, event, platform){
		if(typeof textType == 'undefined') textType = 't';
		if(typeof sandbox == 'undefined') sandbox = true;
		if(typeof platform == 'undefined') platform = this.platform;
		
		var checkPlatformDS = (platform == 'ds_jacutemsabao' || platform == 'ds_american' || platform == 'ds_european');
		
		var keyCode;
		if(typeof event != 'undefined'){
			keyCode = (typeof event.which != 'undefined') ? (event.which) : (0);
		} else {
			keyCode = 0;
		}
		
		var invalidKeycodes = [9, 16, 17, 18, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 91, 92, 93, 144, 145, 225];
		var checkKeycodeInvalid = ($.inArray(keyCode, invalidKeycodes) !== -1);
		if(checkKeycodeInvalid){
			return;
		}
		
		var $field = $(field);
		var $previousField = this.dialogParserTableTextareas.filter("[data-order='" + (parseInt($field.attr('data-order'), 10) - 1) + "']");
		var $divPreview = $('#' + previewFieldId);
		
		var text = $field.val();
		var tag = false;
		var hasNameTag = false;
		var tagText = '';
		var checkFirstField = ($previousField.length == 0);
		var fieldSection = parseInt($field.attr('data-section'), 10);
		var previousFieldSection = parseInt($previousField.attr('data-section'), 10);
		
		// Adding parent class for DS platform detection
		if(checkPlatformDS){
			$divPreview.addClass('ds');
		} else {
			$divPreview.removeClass('ds');
		}
		
		if(textType == 'c'){
			var $divCharacterName = $divPreview.children('div.character-name');
			$divCharacterName.html(text);
		} else if(textType == 't'){
			var $divTextWindow = $divPreview.children('div.text-window');
			var $divCharacterName = $divPreview.children('div.character-name');
			$divTextWindow.html('');
			
			// Setting platform for preview
			$divTextWindow.removeClass('n3ds ds_jacutemsabao ds_american ds_european');
			if(checkPlatformDS){
				$divTextWindow.addClass(platform);
			} else {
				$divTextWindow.addClass('n3ds');
			}
			
			// Inserting {b} when user presses enter
			if(keyCode == 13 && !sandbox){
				var cursorPos = $field.prop('selectionStart') - 1;
				var textBefore = text.substring(0,  cursorPos);
				var textAfter  = $.trim( text.substring(cursorPos, text.length) );
				text = textBefore + '{b}\n' + textAfter;
				
				$field.val(text).prop('selectionEnd', cursorPos + 4).trigger('input');
			}
			
			// Defining last color, if from second field onwards
			if(!checkFirstField){
				// Setting color of previous field as last used color.
				// However, if the section changes, color must be resetted.
				var lastColor;
				if((fieldSection == previousFieldSection)){
					lastColor = parseInt($previousField.attr('data-color'), 10);
				} else {
					lastColor = 0;
				}
				this.lastColor = this.getColorClass(lastColor);
			}
			
			// Iterating over all characters inside text field
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
							this.lastName = this.getName(characterCode);
						} else if(tagText.startsWith('color:')){
							var tmp = tagText.split(':');
							var colorCode = parseInt(tmp.pop(), 10);
							
							this.lastColor = this.getColorClass(colorCode);
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
					this.lastName = this.getName(code_server);
				}
				
				$divCharacterName.html(this.lastName);
				
				// Analysing current block
				var returnAnalysis = this.analyseScriptBlock($divTextWindow);
				if(returnAnalysis !== true){
					$divTextWindow.closest('div.dialog-preview').addClass('invalid').attr('title', returnAnalysis.message);
				} else {
					$divTextWindow.closest('div.dialog-preview').removeClass('invalid').removeAttr('title');
				}
			}
		}
	}
	
	this.getName = function(code){
		var $equivalenceTable = $('#equivalence-table');
		var $tbodyEquivalenceTable = $equivalenceTable.children('tbody');
		var $inputName;
		
		if(this.nameType == 'a'){
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
	
	this.showTextPreview = function(scriptText){
		var $divTextPreview = $('#text-preview');
		var $textareaPreview = $divTextPreview.find('textarea');
		
		$divTextPreview.on({
			'shown.bs.modal': function(){
				$textareaPreview.val(scriptText);
			},
			'hidden.bs.modal': function(){
				$textareaPreview.val('');
			}
		});
		$divTextPreview.modal('show');
	}
	
	this.showScriptConfigSettings = function(){
		$('#config-settings').modal('show');
		
		if(this.platform == 'ds_jacutemsabao'){
			$('#config-platform-ds-jacutemsabao').prop('checked', true);
		} else if(this.platform == 'ds_american'){
			$('#config-platform-ds-american').prop('checked', true);
		} else if(this.platform == 'ds_european'){
			$('#config-platform-ds-european').prop('checked', true);
		} else {
			$('#config-platform-3ds').prop('checked', true);
		}
		if(this.nameType == 'o'){
			$('#config-name-type-original').prop('checked', true);
		} else {
			$('#config-name-type-adapted').prop('checked', true);
		}
		if(this.invalidateLargeLines){
			$('#invalidate-large-lines-true').prop('checked', true);
		} else {
			$('#invalidate-large-lines-false').prop('checked', true);
		}
		if(this.mobileShowInitially == 'p'){
			$('#config-mobile-show-initially-preview').prop('checked', true);
		} else {
			$('#config-mobile-show-initially-textfield').prop('checked', true);
		}
	}
	
	this.hideScriptConfigSettings = function(){
		$('#config-settings').modal('hide');
	}
	
	this.showScriptSaveSettings = function(){
		var $dialogParserTable = $('#dialog-parser-table');
		var filename = $dialogParserTable.attr('data-filename');
		
		var data = new Date();
		data = new Date(data.getTime() - (data.getTimezoneOffset() * 60000)).toJSON();
		data = data.slice(0, 19).replace(/T/g, '-').replace(/:/g, '-');
		filename += ' (' + data + ')';
		
		$('#save-settings').modal('show');
		$('#save-name-field').val(filename).focus();
	}
	
	this.hideScriptSaveSettings = function(){
		$('#save-settings').modal('hide');
	}
	
	this.showScriptAnalysisSettings = function(){
		$('#analysis-settings').modal('show');
		if(this.invalidateLargeLines){
			$('#analysis-invalidate-large-lines-true').prop('checked', true);
		} else {
			$('#analysis-invalidate-large-lines-false').prop('checked', true);
		}
	}
	
	this.hideScriptAnalysisSettings = function(){
		$('#analysis-settings').modal('hide');
	}
	
	this.showScriptExportSettings = function(){
		var $dialogParserTable = $('#dialog-parser-table');
		var filename = $dialogParserTable.attr('data-filename');
		
		var data = new Date();
		data = new Date(data.getTime() - (data.getTimezoneOffset() * 60000)).toJSON();
		data = data.slice(0, 19).replace(/T/g, '-').replace(/:/g, '-');
		filename += ' (' + data + ')';
		
		$('#export-settings').modal('show');
		$('#export-name-field').val(filename).focus();
	}
	
	this.hideScriptExportSettings = function(){
		$('#export-settings').modal('hide');
	}
	
	this.toggleFileOrigin = function(radio){
		var $radio = $(radio);
		var $inputFileField = $('#file-field');
		var $divFileList = $('#file-list');
		
		var fileOrigin = $radio.val();
		if(fileOrigin == 'f'){
			$inputFileField.removeAttr('disabled').attr('required', 'required');
			$divFileList.hide().find("[type='radio']").prop('checked', false).removeAttr('required');
			$divFileList.find("label.btn-primary").removeClass('btn-primary').addClass('btn-default');
		} else {
			$inputFileField.attr('disabled', 'disabled').removeAttr('required');
			$divFileList.show().find("[type='radio']").attr('required', 'required');
		}
	}
	
	this.selectFileFromList = function(radio){
		var $radio = $(radio);
		var $label = $("label[for='" + $radio.attr('id') + "']");
		var $divFileList = $('#file-list');
		
		$divFileList.find('div.col').find('label.btn').removeClass('btn-primary').addClass('btn-default');
		$label.addClass('btn-primary').removeClass('btn-default');
	}
	
	this.changePreviewPlatform = function(radio){
		var $radio = $(radio);
		
		var platform = $radio.val();
		this.platform = platform;
		
		this.updatePreviewVisibleTextareas();
	}
	
	this.changeDefaultNameTypes = function(radio){
		var $radio = $(radio);
		
		var nameType = $radio.val();
		this.nameType = nameType;
		
		this.updatePreviewVisibleTextareas();
	}
	
	this.changeMobileShowInitially = function(radio){
		var $radio = $(radio);
		var $dialogParserTable = $('#dialog-parser-table');
		
		var tableObject = $dialogParserTable.DataTable();
		var mobileShowInitially = $radio.val();
		this.mobileShowInitially = mobileShowInitially;
		
		this.updatePreviewVisibleTextareas();
		tableObject.draw(false);
	}
	
	this.toggleLargeLinesInvalidation = function(radio){
		var $radio = $(radio);
		var invalidateLargeLines = $radio.val();
		
		this.invalidateLargeLines = (invalidateLargeLines == 'true');
	}
	
	this.updatePreviewVisibleTextareas = function(){
		var $dialogParserTable = $('#dialog-parser-table');
		var $textareas = $dialogParserTable.find('textarea');
		$textareas.trigger('keyup');
	}
	
	this.addNewDialogBlock = function(button){
		var $button = $(button);
		var $tr = $button.closest('tr');
		var $dialogParserTable = $('#dialog-parser-table');
		var tableObject = $dialogParserTable.DataTable();
		
		var currentOrder = parseFloat( $tr.find('.order').first().html() );
		var currentSection = ( $tr.find('.section').first().html() ).replace(/[{}]/g, '');
		var currentBlockNumber = parseFloat( $tr.find('.block-number').first().html() );
		
		var newOrder = (currentOrder + 0.01).toFixed(2);
		var newBlockNumber = (currentBlockNumber + 0.01).toFixed(2);
		var newDialogId = 's' + currentSection + '-' + (newOrder.toString().replace(/\./g, '_')) + '-dialog';
		
		var $trClone = $tr.clone();
		var $newTdFormFields = $trClone.children('td.form-fields');
		var $newTextarea = $newTdFormFields.find('textarea');
		var $newTdPreviewConteiners = $trClone.children('td.preview-conteiners');
		var $newDivDialogPreview = $newTdPreviewConteiners.children('div.dialog-preview');
		var $newButtonGroups = $newTdPreviewConteiners.find('div.btn-group');
		
		$trClone.find('.order').html(newOrder);
		$trClone.find('.block-number').html(newBlockNumber);
		
		$newTextarea.removeAttr('onkeyup data-highlight-instantiated').attr({
			'data-order': newOrder,
			'data-block': newBlockNumber,
			'onkeyup': "aade.updatePreview(this, '" + newDialogId + "', 't', false)"
		});
		
		$newTdFormFields.find('div.highlightTextarea').remove();
		$newTdFormFields.append($newTextarea[0].outerHTML);
		$newTdFormFields.find('textarea').val('{p}');
		
		$newDivDialogPreview.attr('id', newDialogId);
		$newButtonGroups.children('button.remove-block').remove();
		var $newButtonRemoveDialogBlock = $('<button />').addClass('btn btn-danger remove-block').attr({
			'tabindex': '-1',
			'title': 'Remover bloco de diálogo',
			'onclick': 'aade.removeDialogBlock(this)'
		}).html('<span class="glyphicon glyphicon-minus"></span>');

		$newButtonGroups.append($newButtonRemoveDialogBlock[0].outerHTML);
		
		// Updating selector property with all textareas in an property
		tableObject.row.add($trClone);
		this.dialogParserTableTextareas = $( tableObject.rows().nodes() ).find("textarea.text-field");
		tableObject.draw(false);
		
		this.incrementTotalDialogsFooter();
	}
	
	this.removeDialogBlock = function(button){
		var $button = $(button);
		var $tr = $button.closest('tr');
		var $dialogParserTable = $('#dialog-parser-table');
		var tableObject = $dialogParserTable.DataTable();
		
		// Updating selector property with all textareas in an property
		tableObject.row($tr).remove();
		this.dialogParserTableTextareas = $( tableObject.rows().nodes() ).find("textarea.text-field");
		tableObject.draw(false);
		
		this.decrementTotalDialogsFooter();
	}
	
	this.incrementTotalDialogsFooter = function(){
		var $dialogParserTable = $('#dialog-parser-table');
		var $tfoot = $dialogParserTable.children('tfoot');
		var $spanTotalDialogBlocks = $tfoot.find('span.total-dialog-blocks');
		var total = parseInt($spanTotalDialogBlocks.html(), 10);
		
		total++;
		
		$spanTotalDialogBlocks.html(total);
	}
	
	this.decrementTotalDialogsFooter = function(){
		var $dialogParserTable = $('#dialog-parser-table');
		var $tfoot = $dialogParserTable.children('tfoot');
		var $spanTotalDialogBlocks = $tfoot.find('span.total-dialog-blocks');
		var total = parseInt($spanTotalDialogBlocks.html(), 10);
		
		total--;
		
		$spanTotalDialogBlocks.html(total);
	}
	
	this.maskFilenameInput = function(event){
		var keyCode = event.which;
		
		var invalidKeycodes = [81, 87, 106, 111, 188, 190, 191, 192, 220, 221];
		var checkKeycodeInvalid = ($.inArray(keyCode, invalidKeycodes) !== -1);
		if(checkKeycodeInvalid){
			return false;
		} else {
			return true;
		}
	}
	
	this.previewScript = function(){
		var that = this;
		that.showLoadingIndicator();
		
		setTimeout(function(){
			var scriptText = that.generateScriptText();
			
			that.hideLoadingIndicator();
			
			that.showTextPreview(scriptText);
		}, 500);
	}
	
	this.saveScript = function(saveFileForm){
		var $saveNameField = $('#save-name-field');
		
		var that = this;
		that.hideScriptSaveSettings();
		that.showLoadingIndicator();
		
		setTimeout(function(){
			var scriptText = that.generateScriptText();
			
			var filename = $saveNameField.val() + '.txt';
			var file = new Blob([scriptText], {type: "text/plain;charset=utf-8"});
			
			saveAs(file, filename, true);
			that.hideLoadingIndicator();
		}, 500);
		
		// Needed to avoid form submission
		return false;
	}
	
	this.exportScript = function(){
		var $exportNameField = $('#export-name-field');
		var $exportFormatField = $('#export-format-field');
		
		var that = this;
		
		that.hideScriptExportSettings();
		that.showLoadingIndicator();
		
		setTimeout(function(){
			var exportedScriptText = convertHtmlToRtf( that.generateExportedScriptText() );
			
			that.hideLoadingIndicator();
			
			var filename = $exportNameField.val();
			var format = $exportFormatField.val();
			var filenameWithFormat = filename + '.' + format;
			
			var blob = new Blob([exportedScriptText], {type: "text/plain"});
			saveAs(blob, filenameWithFormat, true);
		}, 500);
		
		// Needed to avoid form submission
		return false;
	}
	
	this.generateScriptText = function(){
		var $dialogParserTable = $('#dialog-parser-table');
		var tableObject = $dialogParserTable.DataTable();
		
		var scriptText = '';
		var scriptSections = [];

		$( tableObject.rows().nodes() ).find('textarea.text-field').sort(function(a, b){
			// Sort all textareas by id attribute, to avoid messing
			// with the order of dialogues
			return parseFloat( $(a).attr('data-order') ) - parseFloat( $(b).attr('data-order') );
		}).each(function(){
			var $textarea = $(this);
			var section = $textarea.attr('data-section');
			var text = $textarea.val();

			var checkSectionInserted = ($.inArray(section, scriptSections) !== -1);
			if(!checkSectionInserted){
				scriptSections.push(section);

				scriptText += ('\n\n{{' + section + '}}\n');
			}

			scriptText += (text + '\n');
		});
		
		return scriptText;
	}
	
	this.generateExportedScriptText = function(){
		var $dialogParserTable = $('#dialog-parser-table');
		var tableObject = $dialogParserTable.DataTable();
		
		var scriptText = "<b>SCRIPT DUMPADO APENAS PARA FINS DE ANÁLISE E REVISÃO</b><br />";
		scriptText += "<b>NÃO TRADUZA O SCRIPT POR AQUI, MAS SIM PELO PRÓPRIO AADE!</b><br /><br />";
		var scriptSections = [];
		var that = this;
		var characterCode = null;

		$( tableObject.rows().nodes() ).find('textarea.text-field').sort(function(a, b){
			// Sort all textareas by id attribute, to avoid messing
			// with the order of dialogues
			return parseFloat( $(a).attr('data-order') ) - parseFloat( $(b).attr('data-order') );
		}).each(function(){
			var $textarea = $(this);
			var order = $textarea.attr('data-order');
			var section = $textarea.attr('data-section');
			var block = $textarea.attr('data-block');
			var text = $textarea.val();
			
			// Getting character name
			var characterTags = text.match(/{name:[ ]*[0-9]*}/g);
			if(characterTags != null && characterTags.length > 0){
				var tagText = characterTags[0];
				var tmp = tagText.split(':');
				characterCode = parseInt(tmp.pop(), 10);
			}
			var characterName = that.getName(characterCode);
			
			// Formatting text, in order to remove all tags
			text = $.trim( text.replace(/{b}/g, '|').replace(/{(.*?)}/g, '').replace(/\n/g, '').replace(/\|/g, '<br />') );
			text = '<b>Ordem: ' + order + ' - Número: ' + block + ' - Personagem: ' + characterName + '</b><br />' + text;

			var checkSectionInserted = ($.inArray(section, scriptSections) !== -1);
			if(!checkSectionInserted){
				scriptSections.push(section);

				scriptText += ('<b>SEÇÃO ' + section + '</b><br /><br />');
			}

			scriptText += (text + '<br /><br />');
		});
		
		return scriptText;
	}
	
	this.analyzeScript = function(){
		var $dialogParserTable = $('#dialog-parser-table');
		var tableObject = $dialogParserTable.DataTable();
		
		var total_pages = tableObject.page.info().pages;
		
		this.hideScriptAnalysisSettings();
		this.showLoadingIndicator();
		var that = this;
		
		setTimeout(function(){
			var returnAnalysis = true;
			var $divInvalidTextWindow;
			var message = '';

			for(var page=0; page<total_pages; page++){
				tableObject.page(page).draw(false);
				$dialogParserTable.find('div.text-window').each(function(){
					var $divTextWindow = $(this);
					returnAnalysis = that.analyseScriptBlock($divTextWindow);
					
					if(returnAnalysis !== true){
						$divInvalidTextWindow = returnAnalysis.invalidBlock;
						message = returnAnalysis.message;
						return false;
					}
				});

				if(returnAnalysis !== true){
					break;
				}
			}
			that.hideLoadingIndicator();
			
			if(returnAnalysis !== true){
				$divInvalidTextWindow.closest('div.dialog-preview').addClass('invalid');
				that.showPopoverInvalidBlock($divInvalidTextWindow, message);
			} else {
				alert('Script OK!');
			}
		}, 500);
	}
	
	this.analyseScriptBlock = function(divTextWindow){
		var $divTextWindow = $(divTextWindow);
		
		var block_width = $divTextWindow.outerWidth();
		var caret_right_padding = 0;
		var line_number = 1;
		var line_width = 10;
		var characters_per_line = 0;
		var message = '';
		var that = this;
		var platform = that.platform;
		var checkPlatformDS = (platform == 'ds_jacutemsabao' || platform == 'ds_american' || platform == 'ds_european');
		
		var checkValidBlock = true;
		var checkBlockWidthLastLineReduced = false;
		var checkCenteredBlock = $divTextWindow.hasClass('centered');

		$divTextWindow.children('*').each(function(){
			var $elem = $(this);
			
			if($elem.is('span.letter')){
				// Counting line width and characters on each line
				line_width += $elem.width();
				characters_per_line++;
			} else if($elem.is('br')){
				// Counting each line break
				line_number++;
				line_width = 10;
				characters_per_line = 0;
			}
			
			// For blocks with three lines, defining caret right padding
			// and reducing block width with its value
			if(line_number == 3 && !checkBlockWidthLastLineReduced){
				if(checkCenteredBlock){
					if(checkPlatformDS){
						caret_right_padding = 15;
					} else {
						caret_right_padding = 23;
					}
				} else {
					if(checkPlatformDS){
						caret_right_padding = 13;
					} else {
						caret_right_padding = 17;
					}
				}
				block_width -= caret_right_padding;
				checkBlockWidthLastLineReduced = true;
			}
			
			// Validating block
			if(line_number > 3){
				checkValidBlock = false;
				message = 'Bloco com mais de 3 linhas!';
				return false; // Exit $.each
			}
			if(line_width > block_width){
				var checkInsideCaretArea;
				if(line_number == 3){
					var caret_start = block_width;
					var caret_ending = (block_width + caret_right_padding);
					if(checkCenteredBlock){
						caret_ending += 5;
					}
					
					if((line_width >= caret_start) && (line_width <= caret_ending)){
						checkInsideCaretArea = true;
					} else {
						checkInsideCaretArea = false;
					}
				} else {
					checkInsideCaretArea = false;
				}
				
				checkValidBlock = false;
				if(checkInsideCaretArea){
					message = 'Texto sobrepondo a área do cursor da terceira linha!';
				} else {
					message = 'Largura da linha ultrapassa limite do bloco!';
				}
			}
			if((that.invalidateLargeLines) && (characters_per_line > 32)){
				checkValidBlock = false;
				message = 'Contém linhas com mais de 32 caracteres!';
				return false; // Exit $.each
			}
		});
		
		// Returning true if block is valid, or an array containing the block element
		// and the message being returned
		if(checkValidBlock){
			return true;
		} else {
			return {
				'invalidBlock': $divTextWindow,
				'message': message
			}
		}
	}
	
	this.showPopoverInvalidBlock = function(element, message){
		var $template = $("<div />").addClass('popover danger').attr('role', 'tooltip').append(
			$('<div />').addClass('arrow')
		).append(
			$('<h3 />').addClass('popover-title')
		).append(
			$('<div />').addClass('popover-content')
		);
		
		element.popover({
			'html': true,
			'placement': 'auto left',
			'template': $template,
			'content': message,
			'delay': 200,
			'trigger': 'manual'	
		});
		element.popover('show');
		
		element.add($template).click(function(){
			element.closest('div.dialog-preview').removeClass('invalid');
			element.popover('hide');
		});
	}
	
	this.hidePopoverInvalidBlock = function(element){
		element.popover('hide');
	}
	
	this.loadEquivalenceTable = function(game){
		if(game == ''){
			return;
		}
		
		var that = this;
		$.getScript('js/aade.et.' + game + '.js', function(){
			var $tableEquivalenceTable = $('#equivalence-table');
			var $tbody = $tableEquivalenceTable.children('tbody');
			
			$tbody.children('tr.default').remove();
			var $firstTr = $tbody.children('tr').first();
			
			for(var code in that.equivalenceTable){
				var name = that.equivalenceTable[code];
				var originalName = name.original;
				var adaptedName = name.adapted;
				
				var $newTr = $('<tr />').addClass('default').append(
					$('<td />').addClass('code').html(code)
				).append(
					$('<td />').append(
						$('<input />').attr({
							'type': 'text',
							'name': 'character[' + code + '][original_name]',
							'placeholder': 'Digite o nome original'
						}).val(originalName).addClass('form-control original-name').on({
							'keyup': aade.updatePreviewVisibleTextareas
						})
					)
				).append(
					$('<td />').append(
						$('<input />').attr({
							'type': 'text',
							'name': 'character[' + code + '][adapted_name]',
							'placeholder': 'Digite o nome adaptado'
						}).val(adaptedName).addClass('form-control adapted-name').on({
							'keyup': aade.updatePreviewVisibleTextareas
						})
					)
				).append(
					$('<td />').append(
						$('<button />').attr({
							'type': 'button',
							'onclick': 'aade.removeCharacterEquivalenceTable(this)',
							'disabled': 'disabled'
						}).addClass('btn btn-danger').html(
							$('<span />').addClass('glyphicon glyphicon-remove')
						)
					)
				);
				
				var $element;
				if($firstTr.length > 0){
					$firstTr.before($newTr);
				} else {
					$tbody.append($newTr)
				}
			}
			
			that.updatePreviewVisibleTextareas();
		})
	}
	
	this.addCharacterEquivalenceTable = function(){
		var code = prompt('Digite o código do personagem');
		if(code == null){
			return;
		}
		
		var $equivalenceTable = $('#equivalence-table');
		var $tbody = $equivalenceTable.children('tbody');
		var codes = [];

		$tbody.find('td.code').each(function(){
			var code = this.innerHTML;
			codes.push(code);
		});
		
		if($.inArray(code, codes) !== -1){
			alert('Esse código já está sendo usado.');
			return;
		}
		
		var $clonedTr = $tbody.find('tr').last().clone().removeClass('default');
		var $tdCode = $clonedTr.find('td.code');
		var $inputOriginalName = $clonedTr.find('input.original-name');
		var $inputAdaptedName = $clonedTr.find('input.adapted-name');
		var $buttonRemove = $clonedTr.find('button');
		
		$tdCode.html(code);
		$inputOriginalName.attr('name', 'character[' + code + '][original_name]').val('');
		$inputAdaptedName.attr('name', 'character[' + code + '][adapted_name]').val('');
		$buttonRemove.removeAttr('disabled');
		
		$clonedTr.appendTo($tbody);
		$inputOriginalName.focus();
	}
	
	this.removeCharacterEquivalenceTable = function(button){
		var $button = $(button);
		var $tr = $button.closest('tr');
		$tr.remove();
	}
	
	this.showLoadingIndicator = function(){
		$('#loading-indicator').modal('show');
	}
	
	this.hideLoadingIndicator = function(){
		$('#loading-indicator').modal('hide');
	}
	
	this.getSandboxPlatform = function(){
		var $selectPlatformSandbox = $('#sandbox-platform');
		return $selectPlatformSandbox.val();
	}
	
	this.updateBackgroundsSandbox = function(field){
		var $field = $(field);
		var $selectPlatformSandbox = $('#sandbox-platform');
		var $divSandboxPreview = $('#sandbox');
		var $divSandboxTextWindow = $divSandboxPreview.children('div.text-window');
		var $imgComparativeImage = $('#sandbox-comparative-image');
		
		var image = $field.val();
		var platform = $selectPlatformSandbox.val();
		var checkPlatformDS = (platform == 'ds_jacutemsabao' || platform == 'ds_american' || platform == 'ds_european');
		
		$divSandboxTextWindow.removeClass('n3ds ds_jacutemsabao ds_american ds_european');
		if(checkPlatformDS){
			image += '_ds';
			$divSandboxPreview.addClass('ds');
			$divSandboxTextWindow.addClass(platform);
		} else {
			$divSandboxPreview.removeClass('ds');
			$divSandboxTextWindow.addClass('n3ds');
		}
		$divSandboxPreview.css('background', "url('images/" + image + ".png')");
		$imgComparativeImage.attr('src', 'images/' + image + '_filled.png');
	}
	
	this.updatePlatformSandbox = function(field){
		var $field = $(field);
		var $selectBackgroundSandbox = $('#sandbox-background-field');
		var $textFieldSandbox = $('#sandbox-text-field');
		
		this.updateBackgroundsSandbox($selectBackgroundSandbox[0]);
		$textFieldSandbox.trigger('keyup');
	}
	
	this.formatChar = function(char){
		var charTable = {
			// Symbols
			' ': 'space', '!': 'exclamation', '"': 'double-quotes', '#': 'cerquilha',
			'$': 'money-sign', '%': 'percent', '&': 'ampersand', "'": 'quotes',
			"(": 'open-parenthesis', ")": 'close-parenthesis', '*': 'asterisk',
			'+': 'plus', ',': 'comma', '-': 'minus', '.': 'dot', '/': 'slash',
			':': 'colon', ';': 'semicolon', '<': 'less-than', '=': 'equal',
			'>': 'greater-than', '?': 'interrogation', '@': 'at-sign',
			'©': 'copyright', '[': 'open-square-brackets', ']': 'close-square-brackets',
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
			'Ñ': 'N-tilde', 'Ÿ': 'Y-diaeresis',
			
			// Lowercase accents
			'à': 'a-grave', 'á': 'a-acute', 'â': 'a-circumflex', 'ã': 'a-tilde',
			'ä': 'a-diaeresis', 'ç': 'c-cedilla', 'è': 'e-grave', 'é': 'e-acute', 
			'ê': 'e-circumflex', 'ẽ': 'e-tilde', 'ë': 'e-diaeresis', 'ì': 'i-grave',
			'í': 'i-acute', 'ï': 'i-diaeresis', 'î': 'i-circumflex', 'ò': 'o-grave',
			'ó': 'o-acute', 'ô': 'o-circumflex', 'õ': 'o-tilde', 'ö': 'o-diaeresis',
			'ù': 'u-grave', 'ú': 'u-acute', 'û': 'u-circumflex', 'ü': 'u-diaeresis',
			'ñ': 'n-tilde', 'ÿ': 'y-diaeresis'
			
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
	
	this.getColorClass = function(colorCode){
		if(colorCode == 1){
			return 'color-orange';
		} else if(colorCode == 2){
			return 'color-blue';
		} else if(colorCode == 3){
			return 'color-green';
		} else {
			return '';
		}
	}
	
	this.setDefaultValuesSandboxField = function(character, text){
		var $characterField = $('#sandbox-character-field');
		var $textField = $('#sandbox-text-field');
		
		$characterField.val(character).trigger('keyup');
		$textField.val(text).trigger('keyup');
	}
	
	this.renderSandboxImageOnBrowser = function(characterFieldId, textFieldId, previewFieldId, callback){
		var $characterField = $('#' + characterFieldId);
		var $textField = $('#' + textFieldId);
		var $previewField = $('#' + previewFieldId);
		
		var filename = ( $characterField.val() + '-' + $textField.val() ).replace(/\n/g, ' ');
		
		html2canvas($previewField, {
			'onrendered': function(canvas) {
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
	
	this.renderPreviewImageOnBrowser = function(button){
		var $button = $(button);
		var $tdPreviewConteiners = $button.closest('td.preview-conteiners');
		var $previewField = $tdPreviewConteiners.children('div.dialog-preview');
		var $btnGroup = $previewField.children('div.btn-group');
		var $td = $button.closest('td.preview-conteiners');
		
		var previewFieldId = $previewField.attr('id');
		var filename = 'preview-' + previewFieldId;
		
		$btnGroup.hide();
		html2canvas($td, {
			'onrendered': function(canvas) {
				var width = 320, height = 104;
				var ctx = canvas.getContext('2d');
				var imageData = ctx.getImageData(7, 2, width, height);
				
				canvas.width = width;
				canvas.height = height;
				ctx.putImageData(imageData, 0, 0);
				
				var a = document.createElement('a');
				a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
				a.download = filename + '.png';
				var $a = $(a);
				$('body').append($a);
				a.click();
				$a.remove();
				
				$btnGroup.show();
			}
		});
	}
	
	this.getDevice = function(onresize){
		var that = this;
		if (typeof onresize == 'undefined') onresize = false;
		if (onresize) {
			$(window).off('resize.updateGlobalVariable').on('resize.updateGlobalVariable', function () {
				window.device = that.getDevice(false);
			});
		}
		var envs = ['xs', 'sm', 'md', 'lg'];

		var $el = $('<div>');
		$el.appendTo($('body'));

		for (var i = envs.length - 1; i >= 0; i--) {
			var env = envs[i];

			$el.addClass('hidden-' + env);
			if ($el.is(':hidden')) {
				$el.remove();
				return env;
			}
		}
	}
}

// Instantiating objct for class above
var aade = new aade();
