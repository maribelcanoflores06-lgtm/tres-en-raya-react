export default function Scoreboard({ score }) {
  return (
    <div className="score">
      <div><strong>{score.X}</strong>X</div>
      <div><strong>{score.D}</strong>Empates</div>
      <div><strong>{score.O}</strong>O</div>
    </div>
  )
}
