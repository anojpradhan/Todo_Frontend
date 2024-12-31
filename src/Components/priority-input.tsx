interface DatePriorityProps {
  importance:string[];
  priorityInput: (e: string) => void;
  dateInput: (e: Date|null) => void;
}

export default function DatePriority(props:DatePriorityProps){
  return(
    <>
    <div className="importance">
      <label htmlFor="importance"> Priority:</label>
      <select name="priority-array" id="priority" className="options" onChange={(event)=>props.priorityInput(event.target.value)}>
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
      onChange={(e)=> props.dateInput(e.target.value? new Date(e.target.value):null)} />
    </div>
    </>
  )
}