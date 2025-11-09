# Inatel Modern - Site Institucional Moderno

Website institucional modernizado do Inatel com sistema de vagas personalizado.

## Funcionalidades

### Homepage
- Design moderno e minimalista
- Layout responsivo mobile-first
- Animações suaves de scroll
- Navegação fluida com smooth scroll
- Seções: Educação, Pesquisa & Inovação, Empreendedorismo, Comunidade, Notícias

### Sistema de Vagas
- **Perfil do usuário**: Configure curso, período e áreas de interesse
- **Algoritmo de match**: Calcula compatibilidade personalizada (0-100%)
- **Filtros avançados**: Por tipo (Estágio/CLT) e modalidade (Presencial/Híbrido/Remoto)
- **Ordenação**: Por match, data ou empresa
- **Notificações push**: Alertas mockados de novas vagas compatíveis
- **Candidatura rápida**: Formulário simplificado sem necessidade de login

### Match Algorithm
O sistema calcula a compatibilidade baseado em:
- **Curso (40 pontos)**: Match exato ou cursos relacionados
- **Período (20 pontos)**: Se atende o período mínimo exigido
- **Áreas de interesse (40 pontos)**: Overlap entre interesses do usuário e da vaga

**Score final**: 0-100%
- 70-100%: Match Alto (verde)
- 40-69%: Match Médio (amarelo)
- 0-39%: Match Baixo (cinza)

## Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Fonts**: Inter (Google Fonts)
- **Icons**: Lucide Icons (SVG inline)
- **APIs**: Notification API (browser)
- **Storage**: LocalStorage para preferências e candidaturas

## Estrutura do Projeto

```
inatel-modern/
├── index.html              # Homepage
├── vagas.html             # Página de vagas
├── css/
│   ├── style.css          # Estilos globais
│   └── vagas.css          # Estilos da página de vagas
├── js/
│   ├── main.js            # JavaScript global
│   ├── vagas.js           # Sistema de vagas e match
│   └── notifications.js   # Sistema de notificações
├── data/
│   └── vagas.json         # Dados mockados de vagas
├── images/
│   └── logo-inatel.png    # Logo do Inatel
└── README.md
```

## Como usar

### Desenvolvimento Local

1. Clone o repositório
2. Abra `index.html` em um navegador moderno
3. Ou use um servidor local:

```bash
# Python
python -m http.server 8000

# Node.js (http-server)
npx http-server
```

Acesse: `http://localhost:8000`

### Deploy no GitHub Pages

1. Faça push do código para o GitHub
2. Vá em Settings > Pages
3. Selecione a branch `main` e pasta `/root`
4. Aguarde o deploy (geralmente 1-2 minutos)
5. Acesse em: `https://seu-usuario.github.io/inatel-modern`

## Funcionalidades Implementadas

- [x] Homepage moderna e responsiva
- [x] Página de vagas com filtros
- [x] Sistema de perfil do usuário
- [x] Algoritmo de matching personalizado
- [x] Notificações push mockadas
- [x] Formulário de candidatura
- [x] LocalStorage para persistência
- [x] Design system consistente
- [x] Animações e transições suaves
- [x] 100% client-side (sem backend)

## Notificações Push

### Como ativar:
1. Acesse a página de vagas
2. Clique em "Ativar notificações"
3. Permita notificações no navegador
4. Configure seu perfil (curso, período, interesses)

### Como funciona:
- Sistema verifica a cada 30 segundos (mock)
- 20% de chance de receber uma notificação
- Notificações são baseadas no perfil configurado
- Clique na notificação para abrir a página de vagas

**Nota**: As notificações são simuladas/mockadas para fins de demonstração acadêmica.

## Customização

### Cores
Edite as variáveis CSS em `css/style.css`:

```css
:root {
  --color-primary: #0051A5;
  --color-secondary: #00A3E0;
  --color-accent: #00D4FF;
}
```

### Vagas
Edite `data/vagas.json` para adicionar/remover vagas.

### Cursos
Edite os `<option>` em `vagas.html` para adicionar cursos.

## Navegadores Suportados

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Notification API**: Chrome 22+, Firefox 22+, Safari 7+

## Projeto Acadêmico

Este projeto foi desenvolvido para a disciplina de **Interfaces Humano-Computador (IHC)** do Inatel, focado em design moderno, UX e implementação frontend.

## Autor

Alexandre Tommasi - Estudante Inatel

## Licença

Projeto acadêmico - Inatel © 2025
