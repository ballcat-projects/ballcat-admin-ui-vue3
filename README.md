# ballcat-ui-vue3

项目开发中....

二开时请不要修改 pro-componets 内部文件，其对标 react 版本的 pro-componets，
如有任何需要修改的问题，或者和 react 版本不一致的现象，请提 issues, 会尽快解决。

目前功能还在移植中，由于工作量太大，初版本只考虑移植 pro-layout 以及 pro-table(精简掉 searchform 模块)，
后续 pro-components 将独立出一个仓库进行维护，同时会发布到 npm 仓库，方便引用。

## 包管理工具

项目强制要求使用 pnpm 进行依赖管理，使用 npm 或者 yarn 下载依赖将会报错。
```shell
npm install -g pnpm
pnpm install
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/vuejs/language-tools/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm run dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm run lint
```
