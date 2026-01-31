"use client";

import { useEffect, useState } from "react";
import { Trash2, Loader2, ShieldCheck, User, HardDrive, FileText, Ban, CheckCircle } from "lucide-react";

interface AdminTerminalProps {
    className?: string;
}

export function AdminTerminal({ className }: AdminTerminalProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'files'>('overview');
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [transfers, setTransfers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [usersRes, transfersRes] = await Promise.all([
                fetch('/api/admin/users'),
                fetch('/api/admin/transfers')
            ]);

            const usersData = await usersRes.json();
            const transfersData = await transfersRes.json();

            if (usersData.success) setUsers(usersData.users);
            if (transfersData.success) {
                setTransfers(transfersData.transfers);
                setStats(transfersData.stats);
            }

        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNuke = async (id: string) => {
        if (!confirm("WARNING: This will permanently delete the encrypted vault. This action cannot be undone.")) return;

        setIsDeleting(id);
        try {
            const res = await fetch(`/api/vault/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setTransfers(prev => prev.filter(t => t.transferId !== id));
                fetchData(); // Refresh stats
            }
        } catch (error) {
            alert("Deletion failed");
        } finally {
            setIsDeleting(null);
        }
    };

    const toggleBlockUser = async (userId: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                body: JSON.stringify({ userId, isBlocked: !currentStatus })
            });
            if (res.ok) {
                setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: !currentStatus } : u));
            }
        } catch (error) {
            alert("Action failed");
        }
    };

    const formatBytes = (bytes: number) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const calculateExpiry = (dateString: string) => {
        const diff = new Date(dateString).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? `${days} Days Left` : 'Expired';
    };

    return (
        <div className={`monolith p-8 bg-white border border-black/5 rounded-[2rem] shadow-2xl min-h-[600px] ${className}`}>
            <div className="flex flex-wrap items-center gap-4 mb-8 border-b border-black/5 pb-6">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-black text-white shadow-xl' : 'text-black/40 hover:text-black hover:bg-black/5'}`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-black text-white shadow-xl' : 'text-black/40 hover:text-black hover:bg-black/5'}`}
                >
                    Users
                </button>
                <button
                    onClick={() => setActiveTab('files')}
                    className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'files' ? 'bg-black text-white shadow-xl' : 'text-black/40 hover:text-black hover:bg-black/5'}`}
                >
                    Files
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-black/20" />
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && stats && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-8 bg-black/5 rounded-3xl border border-black/5 flex flex-col items-center justify-center text-center">
                                <FileText className="w-8 h-8 opacity-20 mb-4" />
                                <h3 className="text-4xl font-black mb-1">{stats.totalTransfers}</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Total Uploads</p>
                            </div>
                            <div className="p-8 bg-black/5 rounded-3xl border border-black/5 flex flex-col items-center justify-center text-center">
                                <HardDrive className="w-8 h-8 opacity-20 mb-4" />
                                <h3 className="text-4xl font-black mb-1">{formatBytes(stats.totalStorage)}</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Storage Used</p>
                            </div>
                            <div className="p-8 bg-black/5 rounded-3xl border border-black/5 flex flex-col items-center justify-center text-center">
                                <User className="w-8 h-8 opacity-20 mb-4" />
                                <h3 className="text-4xl font-black mb-1">{users.length}</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Active Users</p>
                            </div>
                        </div>
                    )}

                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-black/5">
                                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-black/30 p-4">User</th>
                                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-black/30 p-4">Email</th>
                                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-black/30 p-4">Plan / Usage</th>
                                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-black/30 p-4">Status</th>
                                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-black/30 text-right p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {users.map((user) => (
                                        <tr key={user._id} className="border-b border-black/5 group hover:bg-black/[0.02]">
                                            <td className="p-4 font-bold">{user.name}</td>
                                            <td className="p-4 text-black/60 font-mono text-xs">{user.email}</td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="px-2 py-0.5 bg-black/5 rounded w-fit text-[10px] font-bold uppercase tracking-wider mb-1">{user.plan}</span>
                                                    <span className="text-[10px] text-black/40 font-mono">{formatBytes(user.storageUsed)}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {user.isBlocked ? (
                                                    <span className="text-red-500 font-bold flex items-center gap-1 text-xs"><Ban className="w-3 h-3" /> Blocked</span>
                                                ) : (
                                                    <span className="text-green-600 font-bold flex items-center gap-1 text-xs"><CheckCircle className="w-3 h-3" /> Active</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => toggleBlockUser(user._id, user.isBlocked)}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${user.isBlocked ? 'bg-black text-white hover:bg-green-600' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                                >
                                                    {user.isBlocked ? 'Unblock' : 'Block'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* FILES TAB */}
                    {activeTab === 'files' && (
                        <div className="grid gap-4">
                            {transfers.length === 0 ? (
                                <div className="text-center py-20 text-black/30 font-bold">No data found.</div>
                            ) : (
                                transfers.map((t) => (
                                    <div key={t.transferId} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-black/5 rounded-2xl hover:border-black/20 hover:shadow-lg transition-all group gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center text-black/40 group-hover:bg-secure group-hover:text-white transition-colors">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm mb-1">{t.files[0]?.name} {t.files.length > 1 && `+${t.files.length - 1}`}</h4>
                                                <div className="flex items-center gap-4 text-[10px] font-mono text-black/40">
                                                    <span>{t.transferId}</span>
                                                    <span className="w-1 h-1 bg-black/20 rounded-full" />
                                                    <span>{calculateExpiry(t.expiresAt)}</span>
                                                    <span className="w-1 h-1 bg-black/20 rounded-full" />
                                                    <span>{t.ownerEmail || 'Guest'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 border-black/5 pt-4 md:pt-0">
                                            <div className="text-right">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-1">Downloads</div>
                                                <div className="font-bold text-sm">{t.downloadCount || 0}</div>
                                            </div>
                                            <div className="h-8 w-px bg-black/10 hidden md:block" />
                                            <button
                                                onClick={() => handleNuke(t.transferId)}
                                                disabled={isDeleting === t.transferId}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl text-red-500 hover:bg-red-50 hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                                                title="Nuke Transfer"
                                            >
                                                {isDeleting === t.transferId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
