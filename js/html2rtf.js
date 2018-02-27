/* Function used to export HTML to RTF files
 */
function convertHtmlToRtf(html) {
	if (!(typeof html === "string" && html)) {
		return null;
	}

	var tmpRichText, hasHyperlinks;
	var richText = html;

	// Singleton tags
	richText = richText.replace(/<(?:hr)(?:\s+[^>]*)?\s*[\/]?>/ig, "{\\pard \\brdrb \\brdrs \\brdrw10 \\brsp20 \\par}\n{\\pard\\par}\n");
	richText = richText.replace(/<(?:br)(?:\s+[^>]*)?\s*[\/]?>/ig, "{\\pard\\par}\n");

	// Empty tags
	richText = richText.replace(/<(?:p|div|section|article)(?:\s+[^>]*)?\s*[\/]>/ig, "{\\pard\\par}\n");
	richText = richText.replace(/<(?:[^>]+)\/>/g, "");

	// Hyperlinks
	richText = richText.replace(
	  /<a(?:\s+[^>]*)?(?:\s+href=(["'])(?:javascript:void\(0?\);?|#|return false;?|void\(0?\);?|)\1)(?:\s+[^>]*)?>/ig,
	  "{{{\n");
	tmpRichText = richText;
	richText = richText.replace(
	  /<a(?:\s+[^>]*)?(?:\s+href=(["'])(.+)\1)(?:\s+[^>]*)?>/ig,
	  "{\\field{\\*\\fldinst{HYPERLINK\n \"$2\"\n}}{\\fldrslt{\\ul\\cf1\n");
	hasHyperlinks = richText !== tmpRichText;
	richText = richText.replace(/<a(?:\s+[^>]*)?>/ig, "{{{\n");
	richText = richText.replace(/<\/a(?:\s+[^>]*)?>/ig, "\n}}}");

	// Start tags
	richText = richText.replace(/<(?:b|strong)(?:\s+[^>]*)?>/ig, "{\\b\n");
	richText = richText.replace(/<(?:i|em)(?:\s+[^>]*)?>/ig, "{\\i\n");
	richText = richText.replace(/<(?:u|ins)(?:\s+[^>]*)?>/ig, "{\\ul\n");
	richText = richText.replace(/<(?:strike|del)(?:\s+[^>]*)?>/ig, "{\\strike\n");
	richText = richText.replace(/<sup(?:\s+[^>]*)?>/ig, "{\\super\n");
	richText = richText.replace(/<sub(?:\s+[^>]*)?>/ig, "{\\sub\n");
	richText = richText.replace(/<(?:p|div|section|article)(?:\s+[^>]*)?>/ig, "{\\pard\n");

	// End tags
	richText = richText.replace(/<\/(?:p|div|section|article)(?:\s+[^>]*)?>/ig, "\n\\par}\n");
	richText = richText.replace(/<\/(?:b|strong|i|em|u|ins|strike|del|sup|sub)(?:\s+[^>]*)?>/ig, "\n}");

	// Strip any other remaining HTML tags [but leave their contents]
	richText = richText.replace(/<(?:[^>]+)>/g, "");
	
	// Upper accents
	richText = richText.replace(/À/g, "\\'c0");
	richText = richText.replace(/Á/g, "\\'c1");
	richText = richText.replace(/Â/g, "\\'c2");
	richText = richText.replace(/Ã/g, "\\'c3");
	richText = richText.replace(/Ä/g, "\\'c4");
	richText = richText.replace(/Ç/g, "\\'c7");
	richText = richText.replace(/É/g, "\\'c9");
	richText = richText.replace(/Ê/g, "\\'ca");
	richText = richText.replace(/Í/g, "\\'cd");
	richText = richText.replace(/Ï/g, "\\'cf");
	richText = richText.replace(/Ñ/g, "\\'c7");
	richText = richText.replace(/Ó/g, "\\'d3");
	richText = richText.replace(/Ô/g, "\\'d4");
	richText = richText.replace(/Õ/g, "\\'d5");
	richText = richText.replace(/Ö/g, "\\'d6");
	richText = richText.replace(/Ú/g, "\\'da");
	richText = richText.replace(/Ü/g, "\\'dc");
	
	// Lower accents
	richText = richText.replace(/à/g, "\\'e0");
	richText = richText.replace(/á/g, "\\'e1");
	richText = richText.replace(/â/g, "\\'e2");
	richText = richText.replace(/ã/g, "\\'e3");
	richText = richText.replace(/ä/g, "\\'e4");
	richText = richText.replace(/ç/g, "\\'e7");
	richText = richText.replace(/é/g, "\\'e9");
	richText = richText.replace(/ê/g, "\\'ea");
	richText = richText.replace(/í/g, "\\'ed");
	richText = richText.replace(/ï/g, "\\'ef");
	richText = richText.replace(/ñ/g, "\\'f1");
	richText = richText.replace(/ó/g, "\\'f3");
	richText = richText.replace(/ô/g, "\\'f4");
	richText = richText.replace(/õ/g, "\\'f5");
	richText = richText.replace(/ö/g, "\\'f6");
	richText = richText.replace(/ú/g, "\\'fa");
	richText = richText.replace(/ü/g, "\\'fc");

	// Prefix and suffix the rich text with the necessary syntax
	richText =
	  "{\\rtf1\\ansi\n" + (hasHyperlinks ? "{\\colortbl\n;\n\\red0\\green0\\blue255;\n}\n" : "") + richText +
	  "\n}";

	return richText;
}
