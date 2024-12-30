interface TodoInputProps {
  name: string;
  placeholder: string;
  onChange: (e: string) => void;
  value: string;
  required?:boolean;
}

export default function TodoInput({ name, placeholder, onChange, value, required=true }: TodoInputProps) {
  return (
    <>
    <div>

    <input
    required={required}
    className="input"
    type="text"
    value={value}
    name={name}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    />
    </div>
    </>
  );
}