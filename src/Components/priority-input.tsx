interface DatePriorityProps {
  importance:string[];
  priorityInput: (e: string) => void;
  dateInput: (e: Date) => void;
  priority: string;
  date:Date;
}

export default function DatePriority(props:DatePriorityProps){
  return(
    <>
    <div className="importance">
      <label htmlFor="importance"> Priority:</label>
      <select defaultValue={props.priority || ""} name="priority-array" id="priority" className="options" onChange={(event)=>props.priorityInput(event.target.value)}>
          {props.importance.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
    </div>
    <div className="deadline">
      <label htmlFor="deadline">Deadline:</label>
      <input type="date"
      // defaultValue={new Date().toLocaleDateString()}
      value={new Date(props.date).toLocaleDateString("en-GB")}
      onChange={(e)=> {
        props.dateInput( new Date(e.target.value))
        console.log(e.target.value)
      }
        } />
    </div>
    </>
  )
}