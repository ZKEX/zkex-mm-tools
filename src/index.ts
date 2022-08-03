import inquirer from 'inquirer'
import { accountState, balances } from './account'
import { deposit } from './deposit'

export const actionBack = '< back'

async function actions(): Promise<any> {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: `Choose a action`,
      choices: ['balances', 'deposit'],
    },
  ])

  const { action } = answers
  if (action === 'balances') {
    console.table(await balances())
  } else if (action === 'deposit') {
    await deposit()
  }

  return await actions()
}

async function main() {
  await accountState()
  await actions()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
