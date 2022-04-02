export function RenderSideBarElement({
  name,
  icon,
  alt,
}: {
  name: string;
  icon: string;
  alt: string;
}) {
  return (
    <div
      key={name}
      className="flex flex-row hover:shadow-lg hover:cursor-pointer hover:bg-slate-100 transition-shadow border-gray-200 border h-10 shadow-md items-center px-4  rounded-md"
    >
      <img className="h-5" src={icon} alt={alt} />
      <p className="text-md select-none text-gray-700  pl-2">{name}</p>
    </div>
  );
}
