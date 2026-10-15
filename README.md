# Minhas Tarefas

Projeto de estudos em React Native, Expo SDK 57, Expo Router, NativeWind e SQLite. Implementação até a etapa 11 do roteiro.

## Executar (etapa 11)

Requer Node.js 22.13 ou superior, npm e Expo Go compatível com SDK 57 no celular.

```sh
npm ci
npm start
```

O terminal exibirá o endereço e o QR Code do Expo. Conecte o celular e o computador à mesma rede Wi-Fi e escaneie o código com o Expo Go. No terminal interativo, `a` abre o emulador Android, `i` abre o simulador iOS (somente macOS), `r` recarrega, `j` abre o depurador e `Ctrl+C` encerra o servidor. O CLI local é executado pelo npm, sem instalação global.

## Funcionalidades

- Criar tarefas com título obrigatório e descrição opcional.
- Editar, concluir, reabrir e excluir tarefas com confirmação.
- Filtrar por Todas, Pendentes e Concluídas, com contadores.
- Persistir tarefas localmente em SQLite entre sessões.
- Atualizar a lista ao retornar do formulário ou puxar para atualizar.
- Exibir carregamento, mensagens de lista vazia e erros com opção de nova tentativa.

Login, Firebase, perfil e câmera ficam fora das etapas 1–11 deste roteiro. Não é necessário configurar credenciais.

## Etapas e organização

As etapas 1–6 já estavam registradas no histórico ao iniciar esta continuação. Cada etapa seguinte recebeu seu próprio commit:

| Etapa | Implementação |
| --- | --- |
| 1 | Projeto Expo com TypeScript |
| 2 | Dependências do SDK 57 |
| 3 | Expo Router e esquema de links |
| 4 | NativeWind, Tailwind, Babel e Metro |
| 5 | Tipos de tarefas em src/types/task.ts |
| 6 | Conexão e tabela SQLite em src/database/database.ts |
| 7 | CRUD em src/database/taskRepository.ts, com inicialização compartilhada do banco |
| 8 | Estado, filtros e recarga em src/hooks/useTasks.ts |
| 9 | Componentes TaskItem, FilterBar e EmptyState |
| 10 | Navegação, lista e formulário em app/ |
| 11 | Execução, compatibilidade das dependências e validações |

O ponto de entrada é `expo-router/entry`. Os arquivos App.tsx e index.ts na raiz são exercícios anteriores e não participam da navegação atual.

## Verificações

```sh
npm run typecheck
npm test
npx expo install --check
npx expo export --platform android --platform ios
```

Os testes usam o repositório real com SQLite do Node como adaptador da ponte nativa. Verificam CRUD, parâmetros SQL, inicialização concorrente, recuperação de falha e persistência em arquivo. A execução no celular deve confirmar também interação, teclado, navegação e aparência nativa.

O alvo desta etapa é Android/iOS pelo Expo Go. A versão web do SQLite exige configuração adicional de WebAssembly e cabeçalhos de isolamento; não faz parte deste roteiro.

Validação desta entrega: TypeScript, quatro testes e exportação dos bundles Android/iOS passaram. O teste de interação no aparelho ainda deve ser realizado. A auditoria npm reportou 38 alertas nas dependências (14 moderados, 23 altos e 1 crítico); corrigir todos exige uma revisão separada de compatibilidade, pois há sugestões que trocam as versões principais de Expo e Tailwind.

Documentação consultada: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) e [SQLite no SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/).
