import { useTranslate } from '@/Hooks/useTranslate';
import { Link } from '@inertiajs/react';
import WidgetCard from '@/Modules/Core/Widgets/WidgetCard';
import { UsersIcon, UserCircleIcon } from '@/Components/Icons';

export default function MembersSummaryWidget({ project, widget, onHide, isDragging, dragHandleProps }) {
    const { t } = useTranslate();
    const members = project?.miembros || [];
    const memberCount = members.length;
    const displayMembers = members.slice(0, 5);
    const remainingCount = memberCount - 5;

    return (
        <WidgetCard
            widget={widget}
            title={t('widgets.members_summary', 'Equipo')}
            icon={UsersIcon}
            onHide={onHide}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
            action={
                project ? (
                    <Link
                        href={route('project.members.index', { proyecto: project.uuid })}
                        className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                        {t('common.view_all', 'Ver todos')}
                    </Link>
                ) : null
            }
        >
            <div className="space-y-2">
                {displayMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/50">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-300 overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
                                {member.profile_photo_url ? (
                                    <img 
                                        src={member.profile_photo_url} 
                                        alt={member.name} 
                                        className="h-full w-full object-cover" 
                                    />
                                ) : (
                                    <UserCircleIcon className="h-6 w-6 text-gray-400" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">
                                    {member.name}
                                </p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                                    {t(`roles.${member.pivot?.rol || 'member'}`, member.pivot?.rol || 'Member')}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {remainingCount > 0 && (
                    <Link
                        href={route('project.members.index', { proyecto: project.uuid })}
                        className="flex items-center justify-center p-2 rounded-lg border-2 border-dashed border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-900 transition-colors group"
                    >
                        <span className="text-xs font-medium text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            +{remainingCount} {t('common.view_all', 'Ver todos')}
                        </span>
                    </Link>
                )}

                {memberCount === 0 && (
                    <div className="text-center py-6">
                        <UsersIcon className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('members.no_members', 'No hay miembros aún.')}
                        </p>
                    </div>
                )}
            </div>
        </WidgetCard>
    );
}
