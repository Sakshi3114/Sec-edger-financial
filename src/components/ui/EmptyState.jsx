export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-16 px-6">
      <p className="text-gray-400 text-4xl mb-4">🔍</p>
      <h3 className="text-base font-semibold text-gray-800 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-5">{description}</p>}
      {action}
    </div>
  );
}
