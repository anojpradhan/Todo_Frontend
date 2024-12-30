interface Card {
  title:string;
  description?: string;
  prioriy?:string;
  deadline?:Date|null;
  onDelete: () => void;
  onEdit: () => void;
}
export default function Card(props:Card){
  return(
    <div className="card">
      <div className="contents">
      <h3 className="card-title">{props.title}</h3>
      <p className="card-description">{props.description}</p>
      <p className="card-description">{props.prioriy}</p>
      <p className="card-description">          {props.deadline
            ? new Date(props.deadline).toLocaleDateString() // Safely format deadline
            : ""}</p>
      </div>
      <div className="card-buttons-content">
      <button className="card-button" onClick={props.onEdit}>Edit</button>
      <button className="card-button" onClick={props.onDelete}>Delete</button>
      </div>
    </div>
  )
}