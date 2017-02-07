# Ace Attorney Image Generator

**Program created to increase speed edition of images from Nintendo 3DS game "Ace Attorney Trilogy".**

*Read this in other languages: [Português do Brasil](README.pt-br.md), [Español](README.es.md).*

[Live preview](http://www.romhacking.net.br/tools/aaig/)

"Ace Attorney Trilogy" is a very big game, with lots of text images to be edited:

*   White buttons with text in wine red color;
*   Proof / Profile names, with dark gray background and texts in orange color;
*   Proof / Profile subtitles, with light green background and texts in dark gray color;
*   Proof / Profile descriptions, with dark gray background and texts in white color;

The traditional way of editing those graphics is through .PSD files in Adobe Photoshop, which ends up being an extremely repetitive and tiresome task for romhackers. This was the main reason why I created this software.

The "Ace Attorney Image Generator" is a program that can generate imagens on the same patterns of "Ace Attorney Trilogy" game. For such task, the following technologies were used:

*   HTML5, for web page creation;
*   CSS3, for text styling on images;
*   JavaScript and [jQuery](https://jquery.com/), for fields' and buttons' programming;
*   [Html2canvas](http://html2canvas.hertzen.com/), for converting HTML elements to PNG images;
*   [Bootstrap](http://getbootstrap.com/), to become this page responsive;
*   [Bootstrap Slider](https://github.com/seiyria/bootstrap-slider), for scale and margin fields;

#### Prerequisites

*   A modern updated web browser. Google Chrome is recommended, since a few CSS behaviour differences can be seen on other browsers such as Firefox, Safari or IE;
*   The "Arial" font installed on your computer. Needed for the right generation of some kinds of images, such as buttons per example (If you're using any Windows SO, you can ignore this);
*   The "Vaud Book" font installed on your computer. Needed for the right generation of some kinds of images, such as descriptions of proofs / profiles;
*   A web server. This software won't work if ran locally by user's web browser¹.

¹ Even if this software being totally local, the method used for image generation (conversion of HTML &lt;canvas&gt; elements to PNG images) can trigger an [uncaught security error of tainted canvases](http://stackoverflow.com/questions/22710627/tainted-canvases-may-not-be-exported) , denying any attempts of data exporting. Thus, we recommend to run this software through a web server (Apache2, per example), even if it's only to serve files to clients.

#### How to use?

1.  Select image type, by clicking on any of the tabs "Buttons", "Proof / Profile Names", etc;
2.  In the text field, type the text to be shown on the image;
3.  Optional: If applicable, change values of scale, font and margins accordingly to the text you typed;
4.  Optional: If you wish to use external fonts, do the following:
    *   In "Font" field, choose "Another";
    *   In the text field on the right, type the name of the font;
    *   Once the font name is typed correctly, your browser will imediatelly make use of it, and show the result below;
5.  After you change values of any form fields, the image is automatically updated on the "Preview" below. Change the form fields as you wish, and check if the preview matches your needs;
6.  Recommended: Undo any custom zoom settings on your web browser, because this can result in wrongly-generated images. Keep your zoom settings always on default values (100%);
7.  Click on "Generate" button, and the image will be automatically generated and saved on PNG format. The filename will be set accordingly to the text you typed on form fields;
8.  Optional: If you messed with all default values, click on "Reset" button and all of them will be resetted to its default values.

#### Feedback

If you find any bug, you can find me on the addresses below:

*   [Brazilian's Romhacking and Translation Forum (Fórum Unificado de Romhacking e Tradução - FURT)](http://www.romhacking.net.br/)
*   [FURT's chat on Discord](https://discord.gg/0V2rK6RK47Okravl)
