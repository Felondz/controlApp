import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslate } from '@/Hooks/useTranslate';
import Pagination from '@/Components/Pagination';
import SelectInput from '@/Components/SelectInput';
import TextArea from '@/Components/TextArea';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import MediaGallery from '@/Components/Common/MediaGallery';
import {
    BugIcon, ChevronDownIcon, CheckCircleIcon, XCircleIcon,
    GlobeAltIcon, CogIcon, InfoIcon, ExclamationTriangleIcon, ClockIcon,
    ChartBarIcon
} from '@/Components/Icons';

const STATUS_COLORS = {
    open: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    dismissed: 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-400',
};

const SEVERITY_COLORS = {
    low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const CATEGORY_ICONS = {
    translation: GlobeAltIcon,
    functionality: CogIcon,
    unclear_info: InfoIcon,
    ui_visual: ExclamationTriangleIcon,
    performance: ClockIcon,
    other: ChartBarIcon,
};

const STAT_CONFIG = [
    { key: 'open', icon: XCircleIcon, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
    { key: 'in_progress', icon: ClockIcon, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { key: 'resolved_today', icon: CheckCircleIcon, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
    { key: 'total', icon: ChartBarIcon, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800' },
];

export default function BugReportsDashboard({ reports, stats, filters }) {
    const { t } = useTranslate();
    const [expandedId, setExpandedId] = useState(null);
    const [editingNotes, setEditingNotes] = useState({});

    const handleFilter = (key, value) => {
        const newFilters = { ...filters, [key]: value || undefined };
        Object.keys(newFilters).forEach(k => { if (!newFilters[k]) delete newFilters[k]; });
        router.get('/ptr/bug-reports', newFilters, { preserveState: true, preserveScroll: true });
    };

    const handleStatusChange = (reportId, reportUuid, status) => {
        router.patch(`/ptr/bug-reports/${reportUuid}`, {
            status,
            developer_notes: editingNotes[reportId] || null,
        }, { preserveState: true, preserveScroll: true });
    };

    const handleSaveNotes = (reportId, reportUuid) => {
        const report = reports.data.find(r => r.id === reportId);
        router.patch(`/ptr/bug-reports/${reportUuid}`, {
            status: report?.status || 'open',
            developer_notes: editingNotes[reportId] || '',
        }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="font-semibold text-xl text-primary-600 dark:text-primary-400 leading-tight flex items-center gap-2">
                        <BugIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        {t('bug_reporter.dashboard_title', 'Bug Reports')}
                        <span className="text-sm font-normal text-gray-500">— PTR</span>
                    </h2>
                    <div className="flex gap-2">
                        <a
                            href={route('ptr.bug-reports.export')}
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-all font-bold shadow-lg shadow-primary-600/20"
                        >
                            <GlobeAltIcon className="w-4 h-4" />
                            {t('bug_reporter.export_json', 'Export JSON')}
                        </a>
                    </div>
                </div>
            }
        >
            <Head title={`${t('bug_reporter.dashboard_title', 'Bug Reports')} — PTR`} />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STAT_CONFIG.map(({ key, icon: Icon, color, bg }) => (
                        <div key={key} className={`${bg} rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        {t(`bug_reporter.stat_${key}`, key)}
                                    </p>
                                    <p className={`text-2xl font-bold ${color}`}>{stats[key] ?? 0}</p>
                                </div>
                                <Icon className={`w-7 h-7 ${color} opacity-60`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('common.filter', 'Filter')}:
                    </span>
                    <SelectInput
                        value={filters?.category || ''}
                        onChange={(e) => handleFilter('category', e.target.value)}
                        className="text-sm"
                    >
                        <option value="">{t('bug_reporter.all_categories', 'All Categories')}</option>
                        {Object.keys(CATEGORY_ICONS).map(cat => (
                            <option key={cat} value={cat}>{t(`bug_reporter.category_${cat}`, cat)}</option>
                        ))}
                    </SelectInput>

                    <SelectInput
                        value={filters?.status || ''}
                        onChange={(e) => handleFilter('status', e.target.value)}
                        className="text-sm"
                    >
                        <option value="">{t('bug_reporter.all_statuses', 'All Statuses')}</option>
                        {Object.keys(STATUS_COLORS).map(status => (
                            <option key={status} value={status}>{t(`bug_reporter.status_${status}`, status)}</option>
                        ))}
                    </SelectInput>

                    <SelectInput
                        value={filters?.severity || ''}
                        onChange={(e) => handleFilter('severity', e.target.value)}
                        className="text-sm"
                    >
                        <option value="">{t('bug_reporter.all_severities', 'All Severities')}</option>
                        {['low', 'medium', 'high'].map(sev => (
                            <option key={sev} value={sev}>{t(`bug_reporter.severity_${sev}`, sev)}</option>
                        ))}
                    </SelectInput>
                </div>

                {/* Bug Reports List */}
                <div className="space-y-3">
                    {reports.data.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                            <CheckCircleIcon className="w-10 h-10 text-green-400 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">
                                {t('bug_reporter.no_reports', 'No bug reports found.')}
                            </p>
                        </div>
                    ) : (
                        reports.data.map((report) => {
                            const CategoryIcon = CATEGORY_ICONS[report.category] || ChartBarIcon;
                            return (
                                <div
                                    key={report.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md"
                                >
                                    {/* Report Header Row */}
                                    <div
                                        className="flex items-center gap-3 p-4 cursor-pointer"
                                        onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                                    >
                                        <CategoryIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                                {report.description}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                                                    {report.user?.name || t('common.unknown', 'Unknown')}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    · {new Date(report.created_at).toLocaleDateString()}
                                                </span>
                                                {(report.module || report.view) && (
                                                    <span className="text-xs font-bold text-primary-500 dark:text-primary-400 uppercase tracking-tighter">
                                                        {report.module ? t(`bug_reporter.module_${report.module}`, report.module) : ''}
                                                        {report.view ? ` > ${t(`bug_reporter.view_${report.view}`, report.view)}` : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
                                                <CategoryIcon className="w-3 h-3" />
                                                {t(`bug_reporter.category_${report.category}`, report.category)}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[report.severity] || ''}`}>
                                                {t(`bug_reporter.severity_${report.severity}`, report.severity)}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[report.status] || ''}`}>
                                                {t(`bug_reporter.status_${report.status}`, report.status)}
                                            </span>
                                        </div>

                                        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedId === report.id ? 'rotate-180' : ''}`} />
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedId === report.id && (
                                        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                                            <div>
                                                <InputLabel value={t('bug_reporter.description', 'Description')} />
                                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                    {report.description}
                                                </p>
                                            </div>

                                            {report.screenshot_path && (
                                                <div>
                                                    <InputLabel value={t('bug_reporter.screenshot', 'Screenshot')} />
                                                    <img
                                                        src={route('ptr.bug-reports.screenshot', { bugReport: report.uuid })}
                                                        alt={t('bug_reporter.screenshot', 'Screenshot')}
                                                        className="max-w-sm rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-90 transition"
                                                        onClick={() => window.open(route('ptr.bug-reports.screenshot', { bugReport: report.uuid }), '_blank')}
                                                    />
                                                </div>
                                            )}

                                            {/* Gallery - Multiple Images */}
                                            {report.images && report.images.length > 0 && (
                                                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                                    <MediaGallery images={report.images} />
                                                </div>
                                            )}

                                            <div>
                                                <InputLabel value={t('bug_reporter.page_url', 'Page URL')} />
                                                <a
                                                    href={report.page_url}
                                                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline break-all"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {report.page_url}
                                                </a>
                                            </div>

                                            {/* Developer Controls */}
                                            <div className="flex flex-col sm:flex-row gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <InputLabel value={t('bug_reporter.status', 'Status')} className="!mb-0" />
                                                    <SelectInput
                                                        value={report.status}
                                                        onChange={(e) => handleStatusChange(report.id, report.uuid, e.target.value)}
                                                        className="text-sm"
                                                    >
                                                        {Object.keys(STATUS_COLORS).map(status => (
                                                            <option key={status} value={status}>
                                                                {t(`bug_reporter.status_${status}`, status)}
                                                            </option>
                                                        ))}
                                                    </SelectInput>
                                                </div>

                                                {report.resolved_at && (
                                                    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 self-center">
                                                        <CheckCircleIcon className="w-4 h-4" />
                                                        {new Date(report.resolved_at).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Developer Notes */}
                                            <div>
                                                <InputLabel value={t('bug_reporter.developer_notes', 'Developer Notes')} />
                                                <TextArea
                                                    value={editingNotes[report.id] ?? report.developer_notes ?? ''}
                                                    onChange={(e) => setEditingNotes(prev => ({ ...prev, [report.id]: e.target.value }))}
                                                    placeholder={t('bug_reporter.notes_placeholder', 'Add notes about this bug...')}
                                                    rows={2}
                                                    className="w-full text-sm"
                                                />
                                                {(editingNotes[report.id] !== undefined && editingNotes[report.id] !== (report.developer_notes || '')) && (
                                                    <PrimaryButton onClick={() => handleSaveNotes(report.id, report.uuid)} className="mt-1">
                                                        {t('common.save', 'Save')}
                                                    </PrimaryButton>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {reports.links && <Pagination links={reports.links} />}
            </div>
        </AuthenticatedLayout>
    );
}
