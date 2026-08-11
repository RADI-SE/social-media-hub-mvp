export function DangerZone({ onDelete }: { onDelete: () => void }) {
    return (
        <div className="flex items-center justify-between w-full border-t border-gray-200 pt-4">
            <div>
                <h3 className="text-sm font-medium text-gray-800">Delete your account</h3>
                <p className="text-sm text-gray-500">
                    When you delete your account, you lose access to Buffer account services, and we permanently delete your personal data.
                </p>
            </div>
            <button
                onClick={onDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
            >
                Delete Account
            </button>
        </div>
    );
}