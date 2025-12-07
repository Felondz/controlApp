import { useTranslate } from '@/Hooks/useTranslate';
import { Link } from '@inertiajs/react';
import WidgetCard from '@/Components/Dashboard/WidgetCard';
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
                <Link
                    href={route('project.members.index', { proyecto: project.id })}
                    className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                    {t('common.view_all', 'Ver todos')}
                </Link>
            }
        >
            <div className="flex items-center justify-between">
                <div className="flex -space-x-2 overflow-hidden">
                    {displayMembers.map((member) => (
                        member.profile_photo_url ? (
                            <img
                                key={member.id}
                                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 object-cover"
                                src={member.profile_photo_url}
                                alt={member.name}
                                title={member.name}
                            />
                        ) : (
                            <div
                                key={member.id}
                                className="inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 dark:bg-gray-700"
                                title={member.name}
                            >
                                <UserCircleIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                            </div>
                        )
                    ))}
                    {remainingCount > 0 && (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
                            +{remainingCount}
                        </div>
                    )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t('members.total_count', { count: memberCount }, `${memberCount} miembros`)}
                </div>
            </div>
        </WidgetCard>
    );
}
