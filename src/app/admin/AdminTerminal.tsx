"use client";

import { useEffect, useState } from "react";
import { Trash2, Loader2, ShieldCheck, User, HardDrive, FileText, Ban, CheckCircle, BarChart3, Users, Folder, ChevronRight, Eye } from "lucide-react";

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
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Search & Filter State
    const [search, setSearch] = useState("");
    const [planFilter, setPlanFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        fetchData();
    }, [activeTab, search, planFilter, statusFilter, page]); // Refetch when filters change

    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'users' || activeTab === 'overview') {
                const query = new URLSearchParams({
                    search,
                    plan: planFilter,
                    status: statusFilter,
                    page: page.toString(),
                    limit: '10'
                });
                const usersRes = await fetch(`/api/admin/users?${query}`);
                const usersData = await usersRes.json();
                if (usersData.success) {
                    setUsers(usersData.users);
                    if (usersData.pagination) {
                        setTotalPages(usersData.pagination.totalPages);
                        setTotalUsers(usersData.pagination.total);
                    }
                }
            }

            if (activeTab === 'files' || activeTab === 'overview') {
                const transfersRes = await fetch('/api/admin/transfers');
                const transfersData = await transfersRes.json();
                if (transfersData.success) {
                    setTransfers(transfersData.transfers);
                    setStats(transfersData.stats);
                }
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

    const handleNukeAll = async () => {
        const confirmNuke = confirm("CRITICAL WARNING: This will permanently delete EVERY SINGLE file, transmission, and discussion on the platform. This action is absolute and irreversible. Purge everything?");
        if (!confirmNuke) return;

        const doubleConfirm = prompt("Type 'PURGE ALL' to confirm absolute deletion:");
        if (doubleConfirm !== "PURGE ALL") return;

        setIsBulkDeleting(true);
        try {
            const res = await fetch("/api/admin/transfers", {
                method: "DELETE",
            });
            if (res.ok) {
                setTransfers([]);
                fetchData(); // Refresh stats
                alert("The mesh has been purged.");
            }
        } catch (error) {
            alert("Mass deletion failed");
        } finally {
            setIsBulkDeleting(false);
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
            <div className="flex flex-wrap items-center gap-4 mb-10 border-b border-black/5 pb-8">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-black text-white shadow-2xl scale-105' : 'bg-black/5 text-black/50 hover:bg-black/10 hover:text-black'}`}
                >
                    <BarChart3 className="w-4 h-4" />
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-black text-white shadow-2xl scale-105' : 'bg-black/5 text-black/50 hover:bg-black/10 hover:text-black'}`}
                >
                    <Users className="w-4 h-4" />
                    Users
                </button>
                <button
                    onClick={() => setActiveTab('files')}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${activeTab === 'files' ? 'bg-black text-white shadow-2xl scale-105' : 'bg-black/5 text-black/50 hover:bg-black/10 hover:text-black'}`}
                >
                    <Folder className="w-4 h-4" />
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
                                <h3 className="text-4xl font-black mb-1">{totalUsers}</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Total Active Users</p>
                            </div>
                        </div>
                    )}

                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            {/* Controls */}
                            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-black/5 p-4 rounded-2xl">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="bg-white border-none rounded-xl px-4 py-2 text-sm font-medium w-full md:w-64 focus:ring-2 focus:ring-black/10 outline-none"
                                    />
                                </div>
                                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                                    <select
                                        value={planFilter}
                                        onChange={(e) => setPlanFilter(e.target.value)}
                                        className="bg-white border-none rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider focus:ring-2 focus:ring-black/10 outline-none cursor-pointer"
                                    >
                                        <option value="all">Check Plan</option>
                                        <option value="free">Free</option>
                                        <option value="pro">Pro</option>
                                        <option value="team">Team</option>
                                    </select>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="bg-white border-none rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider focus:ring-2 focus:ring-black/10 outline-none cursor-pointer"
                                    >
                                        <option value="all">Status</option>
                                        <option value="active">Active</option>
                                        <option value="blocked">Blocked</option>
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-2xl border border-black/5">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-black/5">
                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-black/30 p-4">User</th>
                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-black/30 p-4">Provider</th>
                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-black/30 p-4">Plan / Usage</th>
                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-black/30 p-4">Joined</th>
                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-black/30 p-4">Status</th>
                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-black/30 text-right p-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="p-20 text-center text-black/20 font-bold italic">No users found matching criteria.</td>
                                            </tr>
                                        ) : users.map((user) => (
                                            <tr key={user._id} className="border-b border-black/5 group hover:bg-black/[0.03] transition-colors">
                                                <td className="p-4">
                                                    <div>
                                                        <div className="font-bold">{user.name}</div>
                                                        <div className="text-black/60 font-mono text-xs">{user.email}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="bg-black/5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-black/50">
                                                        {user.provider || 'Email'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col">
                                                        <span className={`px-2 py-0.5 rounded w-fit text-[10px] font-bold uppercase tracking-wider mb-1 ${user.plan === 'pro' ? 'bg-indigo-100 text-indigo-600' : 'bg-black/5'}`}>{user.plan}</span>
                                                        <span className="text-[10px] text-black/40 font-mono">{formatBytes(user.storageUsed)}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-xs font-mono text-black/50">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-4">
                                                    {user.isBlocked ? (
                                                        <span className="text-red-500 font-bold flex items-center gap-1 text-xs"><Ban className="w-3 h-3" /> Blocked</span>
                                                    ) : (
                                                        <span className="text-green-600 font-bold flex items-center gap-1 text-xs"><CheckCircle className="w-3 h-3" /> Active</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setSelectedUser(user)}
                                                            className="p-2 rounded-xl bg-black/5 hover:bg-black/10 transition-all text-black/40 hover:text-black"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => toggleBlockUser(user._id, user.isBlocked)}
                                                            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${user.isBlocked ? 'bg-black text-white hover:bg-green-600' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                                        >
                                                            {user.isBlocked ? 'Unblock' : 'Block'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-between items-center pt-4 border-t border-black/5">
                                <span className="text-xs font-bold text-black/40">Page {page} of {totalPages}</span>
                                <div className="flex gap-2">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-black/5 hover:bg-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Prev
                                    </button>
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-black text-white hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FILES TAB */}
                    {activeTab === 'files' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-red-500/5 p-6 rounded-3xl border border-red-500/10">
                                <div>
                                    <h3 className="text-lg font-black tracking-tight text-red-600">Mesh Purge Control</h3>
                                    <p className="text-xs font-bold text-red-500/50 uppercase tracking-widest">Permanent data elimination zone</p>
                                </div>
                                <button
                                    onClick={handleNukeAll}
                                    disabled={isBulkDeleting || transfers.length === 0}
                                    className="px-8 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-red-600 transition-all disabled:opacity-30 flex items-center gap-3"
                                >
                                    {isBulkDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    Nuke All Files
                                </button>
                            </div>

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
                        </div>
                    )}
                </div>
            )}

            {/* User Details Modal (Simple Implementation) */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
                    <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-black/5 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-10 border-b border-black/5 flex justify-between items-start bg-black/5">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-3xl bg-black text-white flex items-center justify-center shadow-xl">
                                    <User className="w-10 h-10" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tighter mb-1">{selectedUser.name}</h2>
                                    <p className="text-sm font-bold text-black/40 uppercase tracking-widest">{selectedUser.plan} Member</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedUser(null)} className="p-3 rounded-2xl hover:bg-black/5 transition-colors">
                                <Trash2 className="w-6 h-6 text-black/20" />
                            </button>
                        </div>
                        <div className="p-10 grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mb-4">Contact Info</h3>
                                <p className="font-bold text-lg mb-1">{selectedUser.email}</p>
                                <p className="text-xs font-mono text-black/40 leading-none capitalize">Provider: {selectedUser.provider || 'Email'}</p>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mb-4">Storage Usage</h3>
                                <p className="font-bold text-lg mb-1">{formatBytes(selectedUser.storageUsed)}</p>
                                <p className="text-xs font-mono text-black/40 leading-none">Registered on {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="col-span-2 pt-4 border-t border-black/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mb-6">Administrative Control</h3>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            toggleBlockUser(selectedUser._id, selectedUser.isBlocked);
                                            setSelectedUser(null);
                                        }}
                                        className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${selectedUser.isBlocked ? 'bg-green-600 text-white' : 'bg-red-500 text-white'}`}
                                    >
                                        {selectedUser.isBlocked ? 'Unlock Account' : 'Suspend Account'}
                                    </button>
                                    <button className="flex-1 py-5 rounded-2xl border-2 border-black/5 bg-white font-black uppercase tracking-widest text-xs hover:border-black transition-all">
                                        Support Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
