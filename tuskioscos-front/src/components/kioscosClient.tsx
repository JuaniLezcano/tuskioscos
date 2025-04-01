"use client";

import { useEffect, useState } from "react";
import { clientFetch } from "@/utils/api";
import { Kiosco } from "@/types";
import { FiEdit, FiTrash, FiPlus, FiX, FiSearch } from "react-icons/fi";

function Modal({ isOpen, onClose, title, children }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all animate-slideIn">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        <FiX size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function KioscoCard({ kiosco, onDelete, onEdit }: {
    kiosco: Kiosco;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
}) {
    return (
        <div className="border rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
            <span className="font-medium text-gray-700 truncate">{kiosco.name}</span>
            <div className="flex gap-2">
                <button
                    className="p-2 hover:bg-blue-50 rounded-full transition-colors duration-200"
                    onClick={() => onEdit(kiosco.id)}
                    aria-label={`Editar ${kiosco.name}`}
                >
                    <FiEdit className="text-blue-500" />
                </button>
                <button
                    className="p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
                    onClick={() => onDelete(kiosco.id)}
                    aria-label={`Eliminar ${kiosco.name}`}
                >
                    <FiTrash className="text-red-500" />
                </button>
            </div>
        </div>
    );
}

export default function KioscosClient() {
    const [kioscos, setKioscos] = useState<Kiosco[]>([]);
    const [filteredKioscos, setFilteredKioscos] = useState<Kiosco[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newKioscoName, setNewKioscoName] = useState("Nuevo Kiosco");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingKiosco, setEditingKiosco] = useState<Kiosco | null>(null);
    const [editKioscoName, setEditKioscoName] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingKiosco, setDeletingKiosco] = useState<Kiosco | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Función para obtener todos los kioscos
    const fetchKioscos = async () => {
        try {
            setLoading(true);
            const data = await clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/kioscos`);
            setKioscos(data);
            setFilteredKioscos(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching kioscos:", error);
            setError("No se pudieron cargar los kioscos. Por favor, intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKioscos();
    }, []);

    useEffect(() => {
        // Filtrar kioscos cuando cambia el término de búsqueda
        if (searchTerm.trim() === "") {
            setFilteredKioscos(kioscos);
        } else {
            const filtered = kioscos.filter((kiosco) =>
                kiosco.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredKioscos(filtered);
        }
    }, [searchTerm, kioscos]);

    // Función para crear un nuevo kiosco
    const createKiosco = async (name: string) => {
        return clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/kioscos`, {
            method: 'POST',
            body: JSON.stringify({ name })
        });
    };

    // Función para actualizar un kiosco
    const updateKiosco = async (kioscoId: number, name: string) => {
        return clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/kioscos/${kioscoId}`, {
            method: 'PUT',
            body: JSON.stringify({ name })
        });
    };

    // Función para eliminar un kiosco
    const deleteKiosco = async (kioscoId: number) => {
        return clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/kioscos/${kioscoId}`, {
            method: 'DELETE'
        });
    };

    function handleOpenModal() {
        setIsModalOpen(true);
        // Seleccionar todo el texto al abrir el modal para facilitar la edición
        setTimeout(() => {
            const input = document.getElementById("kioscoName");
            if (input) {
                input.focus();
                (input as HTMLInputElement).select();
            }
        }, 100);
    }

    function handleCloseModal() {
        setIsModalOpen(false);
        setNewKioscoName("Nuevo Kiosco");
    }

    function handleCloseEditModal() {
        setIsEditModalOpen(false);
        setEditingKiosco(null);
        setEditKioscoName("");
    }

    function handleCloseDeleteModal() {
        setIsDeleteModalOpen(false);
        setDeletingKiosco(null);
    }

    async function handleAddKiosco() {
        if (!newKioscoName.trim()) {
            setError("El nombre del kiosco no puede estar vacío");
            return;
        }

        try {
            setError(null);
            const newKiosco = await createKiosco(newKioscoName);
            setKioscos((prev) => [...prev, newKiosco]);
            handleCloseModal();
            // Mostrar feedback de éxito (podría ser un toast)
        } catch (error) {
            console.error("Error creating kiosco:", error);
            setError("No se pudo crear el kiosco. Por favor, intente nuevamente.");
        }
    }

    function handleConfirmDeleteKiosco(kioscoId: number) {
        const kioscoToDelete = kioscos.find(k => k.id === kioscoId);
        if (kioscoToDelete) {
            setDeletingKiosco(kioscoToDelete);
            setIsDeleteModalOpen(true);
        }
    }

    async function handleDeleteKiosco() {
        if (!deletingKiosco) return;

        try {
            setError(null);
            await deleteKiosco(deletingKiosco.id);
            setKioscos((prev) => prev.filter((k) => k.id !== deletingKiosco.id));
            handleCloseDeleteModal();
            // Mostrar feedback de éxito (podría ser un toast)
        } catch (error) {
            console.error("Error deleting kiosco:", error);
            setError("No se pudo eliminar el kiosco. Por favor, intente nuevamente.");
        }
    }

    function handleEditKiosco(kioscoId: number) {
        const kioscoToEdit = kioscos.find(k => k.id === kioscoId);
        if (kioscoToEdit) {
            setEditingKiosco(kioscoToEdit);
            setEditKioscoName(kioscoToEdit.name);
            setIsEditModalOpen(true);

            // Seleccionar todo el texto al abrir el modal para facilitar la edición
            setTimeout(() => {
                const input = document.getElementById("editKioscoName");
                if (input) {
                    input.focus();
                    (input as HTMLInputElement).select();
                }
            }, 100);
        }
    }

    async function handleSaveEditKiosco() {
        if (!editingKiosco) return;

        if (!editKioscoName.trim()) {
            setError("El nombre del kiosco no puede estar vacío");
            return;
        }

        try {
            setError(null);
            await updateKiosco(editingKiosco.id, editKioscoName);

            // Actualizar el estado local
            setKioscos(prevKioscos =>
                prevKioscos.map(k =>
                    k.id === editingKiosco.id ? { ...k, name: editKioscoName } : k
                )
            );

            handleCloseEditModal();
            // Mostrar feedback de éxito (podría ser un toast)
        } catch (error) {
            console.error("Error actualizando el kiosco:", error);
            setError("No se pudo actualizar el kiosco. Por favor, intente nuevamente.");
        }
    }

    // Manejar la tecla Enter en modales
    function handleKeyPress(e: React.KeyboardEvent, action: () => void) {
        if (e.key === "Enter") {
            action();
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center sm:p-10 p-4 mt-10">
            <div className="w-full max-w-4xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-2xl font-bold text-gray-800">Kioscos</h2>
                        <p className="text-sm text-gray-600">Administración de kioscos</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar kiosco..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full"
                            />
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <button
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-sm hover:bg-gray-950 transition-colors duration-200"
                            onClick={handleOpenModal}
                            aria-label="Agregar kiosco"
                        >
                            <FiPlus size={20} />
                            <span>Agregar kiosco</span>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="">
                            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-900" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                        </div>
                        <p className="text-gray-600">Cargando kioscos...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredKioscos.length > 0 ? (
                                filteredKioscos.map((kiosco) => (
                                    <KioscoCard
                                        key={kiosco.id}
                                        kiosco={kiosco}
                                        onDelete={handleConfirmDeleteKiosco}
                                        onEdit={handleEditKiosco}
                                    />
                                ))
                            ) : (
                                <div className="col-span-3 bg-gray-50 rounded-lg p-8 text-center">
                                    {searchTerm ? (
                                        <>
                                            <p className="text-gray-600 mb-2">No se encontraron kioscos con "{searchTerm}"</p>
                                            <button
                                                onClick={() => setSearchTerm("")}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                Mostrar todos los kioscos
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-600 mb-2">No hay kioscos disponibles</p>
                                            <button
                                                onClick={handleOpenModal}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                Agregar un nuevo kiosco
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        {filteredKioscos.length > 0 && (
                            <div className="mt-4 text-sm text-gray-600">
                                Mostrando {filteredKioscos.length} de {kioscos.length} kioscos
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal para agregar un nuevo kiosco */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Agregar nuevo kiosco"
            >
                <div className="mt-4">
                    <label htmlFor="kioscoName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del kiosco
                    </label>
                    <input
                        id="kioscoName"
                        type="text"
                        value={newKioscoName}
                        onChange={(e) => setNewKioscoName(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleAddKiosco)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-4"
                        placeholder="Ingrese nombre del kiosco"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={handleCloseModal}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleAddKiosco}
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-950 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal para editar un kiosco existente */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                title="Editar kiosco"
            >
                <div className="mt-4">
                    <label htmlFor="editKioscoName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del kiosco
                    </label>
                    <input
                        id="editKioscoName"
                        type="text"
                        value={editKioscoName}
                        onChange={(e) => setEditKioscoName(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleSaveEditKiosco)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-4"
                        placeholder="Ingrese nombre del kiosco"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={handleCloseEditModal}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSaveEditKiosco}
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-950 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal para confirmar eliminación de kiosco */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                title="Confirmar eliminación"
            >
                <div className="mt-4">
                    <div className="p-4 mb-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                        <p className="text-red-800">
                            ¿Está seguro que desea eliminar el kiosco <span className="font-semibold">{deletingKiosco?.name}</span>?
                        </p>
                        <p className="text-sm text-red-700 mt-2">
                            Esta acción no se puede deshacer.
                        </p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={handleCloseDeleteModal}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDeleteKiosco}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}