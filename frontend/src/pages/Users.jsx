// Modern Users Management Page
import { useState, useEffect } from 'react';
import { fetchUsers } from '../api/userApi';
import UserForm from '../components/UserForm';
import PageWrapper from '../components/ui/PageWrapper';
import { Users as UsersIcon, UserPlus, Edit2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formUser, setFormUser] = useState(null);

    const loadUsers = async () => {
        const data = await fetchUsers();
        setUsers(data);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            if (selectedUser.id) {
                // Modification
                setFormUser({
                    id: selectedUser.id,
                    username: selectedUser.username,
                    email: selectedUser.email,
                    is_active: selectedUser.is_active,
                    password: "",
                    profile: {
                        role: selectedUser.profile?.role || "user",
                        manager: selectedUser.profile?.manager || null,
                    },
                });
            } else {
                // Ajout
                setFormUser({
                    id: null,
                    username: "",
                    email: "",
                    password: "",
                    is_active: true,
                    profile: { role: "user", manager: null },
                });
            }
        } else {
            setFormUser(null);
        }
    }, [selectedUser]);

    const getRoleBadgeColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'supervisor':
                return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
            case 'manager':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
        }
    };

    return (
        <PageWrapper title="Gestion des utilisateurs" icon={<UsersIcon size={32} />}>
            {/* Add User Button */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setSelectedUser({})}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg"
                >
                    <UserPlus size={20} />
                    Ajouter un utilisateur
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Users List */}
                <div className="lg:col-span-2">
                    <div className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                            Utilisateur
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                            Rôle
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-white font-medium">
                                                {user.username}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.profile?.role)}`}>
                                                    <Shield size={12} />
                                                    {user.profile?.role || "user"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-primary-600/20 hover:bg-primary-600/40 border border-primary-500/50 text-primary-300 rounded-lg text-sm transition-all duration-200"
                                                >
                                                    <Edit2 size={14} />
                                                    Modifier
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>

                            {users.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    Aucun utilisateur trouvé
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* User Form */}
                {formUser && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                {selectedUser?.id ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
                            </h3>
                            <UserForm
                                user={selectedUser?.id ? formUser : null}
                                usersList={users}
                                onSuccess={() => {
                                    setSelectedUser(null);
                                    loadUsers();
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </div>
        </PageWrapper>
    );
}
