import SetGame from "../../components/set-game/set-game.tsx";
import WakeTruffleBot from "../../components/wake-bot/wake-bot.tsx";
import { React, toDist } from '../../deps.ts'

function SetGamePage () {
  return (
    <>
      <SetGame />
      <WakeTruffleBot />
    </>
  )
}

export default toDist(SetGamePage, import.meta.url);