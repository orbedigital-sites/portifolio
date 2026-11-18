# Orbe Digital — Landing page

## Estrutura
- `index.html` — a página (HTML, CSS e lógica do componente num arquivo só)
- `support.js` — runtime que renderiza o componente (não precisa editar)
- `assets/` — todas as imagens. O print do site da Ivan Motos é `assets/00922d475367c1d68daa30ad612aef52.webp`
- `canvas.json` — metadados do editor de Design (opcional)

## Como abrir
Precisa de um servidor local (abrir o arquivo direto com duplo clique pode não carregar o runtime):
- VS Code: extensão **Live Server** → botão direito em `index.html` → "Open with Live Server"
- ou no terminal: `python3 -m http.server 8000` e acesse http://localhost:8000

## Onde editar
- Textos e seções: dentro de `<x-dc>` no `index.html`
- Links do WhatsApp: objeto `wa` na lógica do componente (`{{wa.geral}}`, `{{wa.siteivan}}` etc.)
- Imagens: troque o arquivo em `assets/` ou o `src` correspondente
