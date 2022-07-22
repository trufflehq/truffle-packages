import { TRUFFLE_BOT_URL } from "../../config.ts";
import { Button, React } from '../../deps.ts'

export default function WakeTruffleBot () {

  const truffleBotWakeHandler = async () => {
    await fetch(TRUFFLE_BOT_URL, { method: 'POST' })
  }

  return (
    <div className="c-wake-truffle-bot">
      <h2>Wake Truffle Bot</h2>
      <p>Truffle Bot likes to sleep. If he's not responding to your challenge, you can wake him up with the button below.</p>
      <Button onClick={truffleBotWakeHandler}>Wake up Truffle Bot</Button>
    </div>
  )
}