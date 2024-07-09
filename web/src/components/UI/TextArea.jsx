export default function TextArea({ name, rows = 7, value = "", onChange }) {
  return (
    <div className="relative">
      <textarea
        type="text"
        id={name}
        rows={!rows ? 7 : rows}
        className="!w-full border peer py-4 px-5 rounded-3xl placeholder-transparent focus:outline-primary-tint-1 focus:outline-4 focus:outline-offset-1 outline-none transition-all duration-300 resize-none"
        placeholder={`${name.slice(0, 1).toUpperCase()}${name.slice(1)}`}
        name={name}
        value={value}
        onChange={onChange}
      />
      <label
        htmlFor={name}
        className="absolute left-7 -top-7 transition-all duration-300 text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-7 peer-focus:text-sm peer-focus:text-gray-500">
        {`${name.slice(0, 1).toUpperCase()}${name.slice(1)}`}
      </label>
    </div>
  );
}
