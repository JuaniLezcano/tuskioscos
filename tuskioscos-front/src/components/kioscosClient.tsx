"use client";

import { useEffect, useState } from "react";
import { clientFetch } from "@/utils/api";
import { Kiosco } from "@/types";
import { FiEdit, FiTrash, FiPlus, FiX } from "react-icons/fi";

function Modal({ isOpen, onClose, title, children }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button
                        className="p-1 hover:bg-gray-100 rounded-full"
                        onClick={onClose}
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
        <div className="border rounded-lg p-4 flex items-center justify-between shadow-sm">
            <span>{kiosco.name}</span>
            <div className="flex gap-2">
                <button className="p-2" onClick={() => onEdit(kiosco.id)}>
                    <FiEdit />
                </button>
                <button className="p-2" onClick={() => onDelete(kiosco.id)}>
                    <FiTrash />
                </button>
            </div>
        </div>
    );
}

export default function KioscosClient() {
    const [kioscos, setKioscos] = useState<Kiosco[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newKioscoName, setNewKioscoName] = useState("Nuevo Kiosco");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingKiosco, setEditingKiosco] = useState<Kiosco | null>(null);
    const [editKioscoName, setEditKioscoName] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingKiosco, setDeletingKiosco] = useState<Kiosco | null>(null);

    // Función para obtener todos los kioscos
    const fetchKioscos = async () => {
        try {
            setLoading(true);
            const data = await clientFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/kioscos`);
            setKioscos(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching kioscos:", error);
            setError("No se pudieron cargar los kioscos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKioscos();
    }, []);

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
        try {
            const newKiosco = await createKiosco(newKioscoName);
            setKioscos((prev) => [...prev, newKiosco]);
            handleCloseModal();
        } catch (error) {
            console.error("Error creating kiosco:", error);
            setError("No se pudo crear el kiosco");
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
            await deleteKiosco(deletingKiosco.id);
            setKioscos((prev) => prev.filter((k) => k.id !== deletingKiosco.id));
            handleCloseDeleteModal();
        } catch (error) {
            console.error("Error deleting kiosco:", error);
            setError("No se pudo eliminar el kiosco");
        }
    }

    function handleEditKiosco(kioscoId: number) {
        const kioscoToEdit = kioscos.find(k => k.id === kioscoId);
        if (kioscoToEdit) {
            setEditingKiosco(kioscoToEdit);
            setEditKioscoName(kioscoToEdit.name);
            setIsEditModalOpen(true);
        }
    }

    async function handleSaveEditKiosco() {
        if (!editingKiosco) return;
        
        try {
            await updateKiosco(editingKiosco.id, editKioscoName);
            
            // Actualizar el estado local
            setKioscos(prevKioscos => 
                prevKioscos.map(k => 
                    k.id === editingKiosco.id ? { ...k, name: editKioscoName } : k
                )
            );
            
            handleCloseEditModal();
        } catch (error) {
            console.error("Error actualizando el kiosco:", error);
            setError("No se pudo actualizar el kiosco");
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-start p-4 my-10">
            <div className="w-full max-w-4xl">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold">Kioscos</h2>
                        <p className="text-sm text-gray-600">Alta, baja y modificación</p>
                    </div>
                    <button
                        className="p-2 bg-white border rounded-md shadow-sm"
                        onClick={handleOpenModal}
                        aria-label="Agregar kiosco"
                    >
                        <FiPlus size={24} />
                    </button>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {loading ? (
                    <p className="text-center">Cargando kioscos...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {kioscos.length > 0 ? (
                            kioscos.map((kiosco) => (
                                <KioscoCard
                                    key={kiosco.id}
                                    kiosco={kiosco}
                                    onDelete={handleConfirmDeleteKiosco}
                                    onEdit={handleEditKiosco}
                                />
                            ))
                        ) : (
                            <p className="col-span-3 text-center text-gray-500">No hay kioscos disponibles</p>
                        )}
                    </div>
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
                        className="w-full p-2 border rounded mb-4"
                        placeholder="Ingrese nombre del kiosco"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={handleCloseModal}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleAddKiosco}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
                        className="w-full p-2 border rounded mb-4"
                        placeholder="Ingrese nombre del kiosco"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={handleCloseEditModal}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSaveEditKiosco}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
                    <p className="mb-4">
                        ¿Está seguro que desea eliminar el kiosco <span className="font-semibold">{deletingKiosco?.name}</span>?
                    </p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={handleCloseDeleteModal}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDeleteKiosco}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}