// Labeled text input used across the auth forms.
export function Field({
  label,
  name,
  type = "text",
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-content">{label}</span>
      <input name={name} type={type} className="input" {...rest} />
    </label>
  );
}
