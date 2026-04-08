import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { router, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import ProjectCard from '@/Components/Project/ProjectCard'; // Adjust path if needed (e.g., ../../Project/ProjectCard)
import { PlusIcon, EmptyStateIcon } from '@/Components/Icons';
import { useOnboarding } from '@/Hooks/useOnboarding';

export default function DraggableProjectGrid({ projects = [], user, settingsKey = 'global_dashboard' }) {
    const { t } = useTranslate();
    const [enabled, setEnabled] = useState(false);
    const { isTourCompleted } = useOnboarding();
    const tourPending = !isTourCompleted('create_project');

    // Determine saved order
    const savedSettings = user?.settings?.[settingsKey] || {};
    const savedOrder = savedSettings.project_order || [];

    // Order projects
    const orderProjects = (currentProjects, orderList) => {
        const orderMap = new Map();
        orderList.forEach((id, index) => orderMap.set(parseInt(id), index));

        return [...currentProjects].sort((a, b) => {
            const indexA = orderMap.has(a.id) ? orderMap.get(a.id) : 99999;
            const indexB = orderMap.has(b.id) ? orderMap.get(b.id) : 99999;
            return indexA - indexB;
        });
    };

    const [orderedProjects, setOrderedProjects] = useState(() => orderProjects(projects, savedOrder));

    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);

    // Also update when projects prop changes (e.g. added new project)
    useEffect(() => {
        setOrderedProjects(orderProjects(projects, savedOrder));
    }, [projects, savedOrder.join(',')]); // eslint-disable-line

    const handleDragEnd = useCallback((result) => {
        if (!result.destination) return;
        const { source, destination } = result;
        if (source.index === destination.index) return;

        const newProjects = Array.from(orderedProjects);
        const [removed] = newProjects.splice(source.index, 1);
        newProjects.splice(destination.index, 0, removed);

        setOrderedProjects(newProjects);

        // Save to backend
        const newOrder = newProjects.map(p => p.id);
        const updatedDashboardSettings = {
            ...savedSettings,
            project_order: newOrder
        };

        const payload = {
            [settingsKey]: updatedDashboardSettings
        };

        router.post(
            route('preferences.dashboard.update'),
            { settings: payload },
            {
                preserveScroll: true,
                preserveState: true,
                only: ['auth'],
            }
        );

    }, [orderedProjects, savedSettings]);

    if (!enabled) return null;

    if (!projects || projects.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-gray-900 dark:text-gray-100 h-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center py-12">
                <div className="text-4xl mb-4 text-primary-500">
                    <EmptyStateIcon className="h-16 w-16" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {t('dashboard.no_projects')}
                </h3>
                <Link
                    href={route('mis-proyectos.create', tourPending ? { start_tour: 1 } : {})}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 transition ease-in-out duration-150"
                >
                    {t('projects.create_new')}
                </Link>
            </div>
        );
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="projects-grid" direction="horizontal">
                {(provided, snapshot) => (
                    <div
                        id="tour-project-list"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6"
                    >
                        {orderedProjects.map((proyecto, index) => (
                            <Draggable key={proyecto.id} draggableId={String(proyecto.id)} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        style={provided.draggableProps.style}
                                        className="h-full"
                                    >
                                        <ProjectCard
                                            proyecto={proyecto}
                                            dragHandleProps={provided.dragHandleProps}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}

                        {/* Always visible Add Card */}
                        <Link
                            id="tour-create-project-card"
                            href={route('mis-proyectos.create', tourPending ? { start_tour: 1 } : {})}
                            className="group border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center hover:border-primary-500 dark:hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 min-h-[200px]"
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 flex items-center justify-center mb-3 transition-colors">
                                <PlusIcon className="h-6 w-6 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                {t('projects.create_new')}
                            </span>
                        </Link>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
