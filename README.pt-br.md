# Gerador de Imagens do Ace Attorney

**Programa desenvolvido para agilizar na edição de imagens do jogo "Ace Attorney Trilogy", para Nintendo 3DS.**

[Prévia ao vivo](http://www.romhacking.net.br/tools/aaig/)

"Ace Attorney Trilogy" é um jogo bastante extenso, com centenas de imagens com textos a ser editadas:

*   Botões brancos com textos em vermelho cor-de-vinho;
*   Nomes de provas / perfis, com fundo cinza escuro e textos em cor laranja;
*   Subtítulos de provas / perfis, com fundo verde claro e textos em cor cinza escuro;
*   Descrições de provas, com fundo cinza escuro e textos em cor branca;

A maneira tradicional de editar esses gráficos é através de arquivos .PSD via Adobe Photoshop, o que acaba sendo um trabalho extremamente repetitivo e cansativo para os romhackers. Foi justamente pensando em otimizar estes processos que eu criei este software.

O "Gerador de Imagens do Ace Attorney" é um programa que consegue gerar as imagens no padrão do jogo "Ace Attorney Trilogy". Para isso, são utilizadas as seguintes tecnologias:

*   HTML5, para a montagem das páginas;
*   CSS3, para a estilização dos textos nas imagens;
*   JavaScript e [jQuery](https://jquery.com/), para a programação de campos e botões;
*   [Html2canvas](http://html2canvas.hertzen.com/), para conversão de elementos HTML para imagens em PNG;
*   [Bootstrap](http://getbootstrap.com/), para tornar esta página responsiva;
*   [Bootstrap Slider](https://github.com/seiyria/bootstrap-slider), para os campos de escala;

#### Pré-Requisitos

*   Um navegador moderno atualizado. De preferência o Google Chrome, visto que em outros navegadores, como Mozilla Firefox, Safari ou Internet Explorer, poderão surgir algumas diferenças de comportamento de estilizações CSS;
*   A fonte "Arial" instalada no seu computador. Necessária para a geração correta das imagens de botões por exemplo (Caso use Windows, desconsidere);
*   A fonte "Vald Book" instalada no seu computador. Necessária para a geração correta das imagens de descrições de provas por exemplo;
*   Um servidor web. O programa não funcionará se executado localmente pelo navegador do usuário¹.

¹ Mesmo este programa sendo totalmente local, a forma como as imagens são geradas (conversão de elementos <canvas> para imagem PNG) viola certas [diretrizes de segurança de navegadores web](http://stackoverflow.com/questions/22710627/tainted-canvases-may-not-be-exported) . Por isso, recomenda-se executar este programa a partir de um servidor web (Apache2 por exemplo), nem que seja apenas para servir os arquivos para os clientes.

#### Como usar?

1.  Selecione o tipo de imagem a ser gerada, clicando em uma das abas "Botões", "Nome da Prova / Perfil", etc;
2.  No campo de texto, digite o texto a ser inserido na imagem;
3.  Opcional: Altere a escala, fonte e margens de acordo com o texto digitado, se for o caso;
4.  Opcional: Em caso de uso de fontes externas, siga os passos:
    *   No campo "Fonte", escolha a opção "Outra";
    *   Digite o nome da fonte no campo de texto que surgiu ao lado;
    *   Uma vez que o nome tenha sido digitado corretamente, o navegador imediatamente deve fazer uso da mesma e replicar o resultado;
5.  Ao realizar qualquer operação nos itens anteriores a este, a imagem é automaticamente atualizada na seção "Prévia". Verifique se a prévia está de acordo com o seu contexto, e altere os campos anteriores da maneira que lhe for conveniente;
6.  Recomendado: Desfaça qualquer alteração de zoom do seu navegador, pois isto pode prejudicar a geração das imagens. Mantenha os níveis de zoom do seu browser sempre nos valores padrões (100%);
7.  Clique no botão "Gerar", e a imagem será automaticamente gerada e salva em formato PNG, com o arquivo sendo nomeado de acordo com o texto digitado no campo de texto.

#### Considerações gerais

Caso encontre algum bug, você pode me encontrar nos endereços:

*   [Fórum Unificado de Romhacking e Tradução](http://www.romhacking.net.br/)
*   [Chat do FURT, hospedado no Discord](https://discord.gg/0V2rK6RK47Okravl)
