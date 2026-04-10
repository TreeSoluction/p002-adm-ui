// components/ConfirmDeleteModal.js
export default function ConfirmDeleteModal({ open, onClose, onConfirm }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold text-blue-700 mb-4">
          Confirmar deleção
        </h2>
        <p className="mb-6">Tem certeza que deseja deletar esta excursão?</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
}
