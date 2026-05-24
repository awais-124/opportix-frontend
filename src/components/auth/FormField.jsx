export default function FormField({
  label, name, type = "text", register, error, disabled
}) {
  return (
    <div className="input-group">
      <input
        id={name}
        type={type}
        placeholder=" "
        disabled={disabled}
        className={error ? "input-error" : ""}
        {...register(name)}
      />
      <label htmlFor={name}>{label}</label>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}