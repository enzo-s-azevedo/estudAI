# estudAI

Um aplicativo de estudos com ferramentas de IA

## Como Rodar o Projeto

Abra o terminal e execute os seguintes comandos:

```bash
git clone https://github.com/enzo-s-azevedo/estudAI.git
cd estudAI
npm install
npm start
```
## Requisitos

Node.js (versão mínima recomendada: 14.x)

## Controle de Acesso

No projeto, usamos o padrão Proxy para gerenciar o acesso do usuário:

- **`isAdmin`**: Verifica se o usuário logado é um administrador comparando o e-mail com `"admin@admin.com"`.
- **`isAuthenticated`**: Verifica se o usuário está autenticado.
- **`redirectIfNotAuthenticated`**: Redireciona para a página de login se o usuário não estiver autenticado.
- **`redirectIfNotAdmin`**: Redireciona para uma página específica se o usuário não for um administrador e garante que o usuário esteja autenticado.

Essas funções garantem que apenas usuários autenticados e administradores possam acessar áreas protegidas do aplicativo.
