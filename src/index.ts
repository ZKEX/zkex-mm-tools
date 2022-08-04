import inquirer from 'inquirer'
import { checkAccountState, balances, accountState } from './account'
import { deposit } from './deposit'
import { register } from './register'
import { changeWallet, getCurrentAccount } from './secret'

export const actionBack = '< back'

export enum Actions {
  ChangeWallet = '1) Your Wallets',
  AccountDoctor = '2) Account Doctor',
  AccountInfo = '3) Account Info',
  Balances = '4) Balances',
  Deposit = '5) Deposit',
}

async function actions(): Promise<any> {
  const currentAccount = await getCurrentAccount()
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: `Choose a action. (Current: ${currentAccount?.address})`,
      choices: [...Object.values(Actions)],
    },
  ])

  const { action } = answers
  if (action === Actions.AccountInfo) {
    const state = await accountState()
    console.table({
      AccountId: state.id,
      PubKeyHash: state.committed.pubKeyHash,
      AccountStatus:
        state.committed.pubKeyHash === 'sync:0000000000000000000000000000000000000000'
          ? 'Locked'
          : 'Activated',
    })
  } else if (action === Actions.Balances) {
    console.table(await balances())
  } else if (action === Actions.Deposit) {
    await deposit()
  } else if (action === Actions.ChangeWallet) {
    await changeWallet()
  } else if (action === Actions.AccountDoctor) {
    await checkAccountState()
  }

  return await actions()
}

async function main() {
  await actions()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
