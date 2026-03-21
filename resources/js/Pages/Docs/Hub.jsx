import { Head, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import ThemeToggle from '@/Components/ThemeToggle';
import { BookOpenIcon, FolderIcon, CreditCardIcon, UsersIcon, PackageIcon, ChatBubbleLeftRightIcon, ArrowRightIcon } from '@/Components/Icons';

export default function Hub() {
    const { t } = useTranslate();

    const guides = [
        {
            title: t('docs.guide_getting_started', 'Primeros Pasos'),
            description: t('docs.guide_getting_started_desc', 'Aprende a crear tu cuenta, configurar tu primer proyecto e invitar a tu equipo.'),
            href: route('docs.user'),
            icon: BookOpenIcon,
            color: 'primary'
        },
        {
            title: t('docs.guide_projects', 'Proyectos'),
            description: t('docs.guide_projects_desc', 'Cómo crear, organizar y gestionar tus proyectos de manera efectiva.'),
            href: route('docs.user'),
            icon: FolderIcon,
            color: 'success'
        },
        {
            title: t('docs.guide_finance', 'Finanzas'),
            description: t('docs.guide_finance_desc', 'Configura tus cuentas, registra transacciones y entiende tus reportes financieros.'),
            href: route('docs.user'),
            icon: CreditCardIcon,
            color: 'warning'
        },
        {
            title: t('docs.guide_team', 'Trabajo en Equipo'),
            description: t('docs.guide_team_desc', 'Aprende a invitar miembros, asignar tareas y colaborar en tiempo real.'),
            href: route('docs.user'),
            icon: UsersIcon,
            color: 'info'
        },
        {
            title: t('docs.guide_inventory', 'Inventario'),
            description: t('docs.guide_inventory_desc', 'Controla tu stock, registra movimientos y mantén tu inventario actualizado.'),
            href: route('docs.user'),
            icon: PackageIcon,
            color: 'purple'
        },
        {
            title: t('docs.guide_chat', 'Chat y Comunicación'),
            description: t('docs.guide_chat_desc', 'Utiliza el chat integrado para comunicarte con tu equipo sin salir de la plataforma.'),
            href: route('docs.user'),
            icon: ChatBubbleLeftRightIcon,
            color: 'pink'
        }
    ];

    const colorClasses = {
        primary: {
            bg: 'bg-primary-100 dark:bg-primary-900/30',
            icon: 'text-primary-600 dark:text-primary-400',
            hover: 'group-hover:bg-primary-600',
            border: 'border-primary-200 dark:border-primary-800/50',
            cta: 'text-primary-600 dark:text-primary-400'
        },
        success: {
            bg: 'bg-green-100 dark:bg-green-900/30',
            icon: 'text-green-600 dark:text-green-400',
            hover: 'group-hover:bg-green-600',
            border: 'border-green-200 dark:border-green-800/50',
            cta: 'text-green-600 dark:text-green-400'
        },
        warning: {
            bg: 'bg-yellow-100 dark:bg-yellow-900/30',
            icon: 'text-yellow-600 dark:text-yellow-400',
            hover: 'group-hover:bg-yellow-600',
            border: 'border-yellow-200 dark:border-yellow-800/50',
            cta: 'text-yellow-600 dark:text-yellow-400'
        },
        info: {
            bg: 'bg-blue-100 dark:bg-blue-900/30',
            icon: 'text-blue-600 dark:text-blue-400',
            hover: 'group-hover:bg-blue-600',
            border: 'border-blue-200 dark:border-blue-800/50',
            cta: 'text-blue-600 dark:text-blue-400'
        },
        purple: {
            bg: 'bg-purple-100 dark:bg-purple-900/30',
            icon: 'text-purple-600 dark:text-purple-400',
            hover: 'group-hover:bg-purple-600',
            border: 'border-purple-200 dark:border-purple-800/50',
            cta: 'text-purple-600 dark:text-purple-400'
        },
        pink: {
            bg: 'bg-pink-100 dark:bg-pink-900/30',
            icon: 'text-pink-600 dark:text-pink-400',
            hover: 'group-hover:bg-pink-600',
            border: 'border-pink-200 dark:border-pink-800/50',
            cta: 'text-pink-600 dark:text-pink-400'
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50/30 dark:from-gray-900 dark:to-gray-900">
            <Head title={t('docs.hub_title', 'Guías y Ayuda')} />

            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="text-sm font-medium">{t('common.back_home', 'Volver al inicio')}</span>
                        </Link>
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('docs.hub_title', 'Guías y Ayuda')}
                        </h1>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Hero */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-6">
                        <BookOpenIcon className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('docs.hub_welcome_title', 'Aprende a usar ControlApp')}
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('docs.hub_welcome_desc', 'Guías detalladas para aprovechar al máximo cada característica de la plataforma.')}
                    </p>
                </div>
            </section>

            {/* Guides Grid */}
            <section className="pb-20">
                <div className="container mx-auto px-4">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {guides.map((guide, index) => {
                            const colors = colorClasses[guide.color];
                            return (
                                <Link
                                    key={index}
                                    href={guide.href}
                                    className={`group relative bg-white dark:bg-gray-800 rounded-2xl border ${colors.border} p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                                >
                                    <div className={`absolute top-4 right-4 w-12 h-12 ${colors.bg} ${colors.icon} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <guide.icon className="w-6 h-6" />
                                    </div>
                                    
                                    <div className="pr-16">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                            {guide.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                            {guide.description}
                                        </p>
                                        <span className={`inline-flex items-center ${colors.cta} font-medium group-hover:translate-x-2 transition-transform duration-200`}>
                                            {t('docs.read_guide', 'Leer guía')}
                                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Help Banner */}
            <section className="py-12 bg-gradient-to-r from-primary-600 to-primary-700">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        {t('docs.need_help', '¿Necesitas ayuda?')}
                    </h3>
                    <p className="text-primary-100 mb-6 max-w-xl mx-auto">
                        {t('docs.contact_support', 'Si no encuentras lo que buscas, nuestro equipo está listo para ayudarte.')}
                    </p>
                    <a
                        href="mailto:soporte@controlapp.com"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {t('docs.contact_support_btn', 'Contactar soporte')}
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} ControlApp · {t('footer.copyright', 'Todos los derechos reservados')}
                    </p>
                </div>
            </footer>
        </div>
    );
}
