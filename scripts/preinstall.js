// @ts-check
if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn(
    `\u001b[33mThis repository requires using pnpm as the package manager ` +
      `for scripts to work properly.\n` +
      `Note: Please delete node_modules before pnpm install.\u001b[39m\n`
  )
  process.exit(1)
}
