import { Head, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { useState } from 'react';
import ThemeToggle from '@/Components/ThemeToggle';
import { MenuIcon, XIcon, LoginIcon, UserPlusIcon, CheckCircleIcon, ArrowRightIcon } from '@/Components/Icons';

export default function Welcome({ auth }) {
    const { t } = useTranslate();
    const currentYear = new Date().getFullYear();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const problems = [
        {
            title: t('landing.problem_scattered.title', '¿Tienes tus finanzas en hojas de cálculo separadas?'),
            description: t('landing.problem_scattered.desc', 'Perdiendo tiempo reconciliando números y sin visión clara de tu situación financiera real.'),
            icon: '📉'
        },
        {
            title: t('landing.problem_communication.title', '¿Tu equipo se comunica por WhatsApp?'),
            description: t('landing.problem_communication.desc', 'Mensajes perdidos, archivos obsoletos y nadie sabe en qué estado están las tareas.'),
            icon: '💬'
        },
        {
            title: t('landing.problem_tasks.title', '¿Se te escapan tareas importantes?'),
            description: t('landing.problem_tasks.desc', 'Prometiste entregar algo hace semanas y simplemente se te olvidó. El estrés es constante.'),
            icon: '🤯'
        },
        {
            title: t('landing.problem_inventory.title', '¿Controlas tu inventario a mano?'),
            description: t('landing.problem_inventory.desc', 'No sabes cuánto stock tienes, qué productos se venden más y cuándo pedir más suministros.'),
            icon: '📦'
        }
    ];

    const solutions = [
        {
            title: t('landing.solution_finance.title', 'Finanzas en tiempo real'),
            description: t('landing.solution_finance.desc', 'Todos tus ingresos, gastos y presupuestos en un solo lugar. Sin hojas de cálculo, sin errores.'),
            highlight: t('landing.solution_finance.highlight', 'Mira tu flujo de caja al instante')
        },
        {
            title: t('landing.solution_team.title', 'Equipo conectado'),
            description: t('landing.solution_team.desc', 'Chat integrado, tareas asignadas y seguimiento de progreso. Todos saben qué hacer.'),
            highlight: t('landing.solution_team.highlight', 'Colaboración sin caos')
        },
        {
            title: t('landing.solution_tasks.title', 'Tareas que no se olvidan'),
            description: t('landing.solution_tasks.desc', 'Lista de pendientes, fechas límite y recordatorios. Deja de perder proyectos por olvidos.'),
            highlight: t('landing.solution_tasks.highlight', 'Cero tareas perdidas')
        },
        {
            title: t('landing.solution_inventory.title', 'Inventario bajo control'),
            description: t('landing.solution_inventory.desc', 'Stock actualizado automáticamente, alertas de productos bajos y reportes de movimiento.'),
            highlight: t('landing.solution_inventory.highlight', 'Siempre sabiendo qué tienes')
        }
    ];

    const features = [
        {
            title: t('landing.feature_projects.title', 'Proyectos'),
            description: t('landing.feature_projects.desc', 'Gestiona múltiples proyectos con diferentes equipos y objetivos.'),
            icon: '🎯'
        },
        {
            title: t('landing.feature_finance.title', 'Finanzas'),
            description: t('landing.feature_finance.desc', 'Cuentas, transacciones, presupuestos y reportes financieros.'),
            icon: '💰'
        },
        {
            title: t('landing.feature_tasks.title', 'Tareas'),
            description: t('landing.feature_tasks.desc', 'Organiza, asigna y haz seguimiento de todas las tareas.'),
            icon: '✅'
        },
        {
            title: t('landing.feature_chat.title', 'Chat'),
            description: t('landing.feature_chat.desc', 'Comunicación en tiempo real con tu equipo dentro del proyecto.'),
            icon: '💬'
        },
        {
            title: t('landing.feature_inventory.title', 'Inventario'),
            description: t('landing.feature_inventory.desc', 'Control de stock, movimientos y alertas de bajo inventario.'),
            icon: '📦'
        },
        {
            title: t('landing.feature_production.title', 'Producción'),
            description: t('landing.feature_production.desc', 'Gestión de lotes de producción con seguimiento de etapas.'),
            icon: '🏭'
        }
    ];

    const steps = [
        {
            number: '01',
            title: t('landing.step1_title', 'Crea tu cuenta'),
            description: t('landing.step1_desc', 'Regístrate en segundos. Sin tarjeta de crédito requerida.')
        },
        {
            number: '02',
            title: t('landing.step2_title', 'Crea tu primer proyecto'),
            description: t('landing.step2_desc', 'Define tu proyecto, invita a tu equipo y comienza a organizar.')
        },
        {
            number: '03',
            title: t('landing.step3_title', 'Conecta tus finanzas'),
            description: t('landing.step3_desc', 'Vincula tus cuentas y comienza a rastrear cada movimiento.')
        },
        {
            number: '04',
            title: t('landing.step4_title', 'Mantén el control'),
            description: t('landing.step4_desc', 'Accede desde cualquier lugar y mantén todo bajo control.')
        }
    ];

    const stats = [
        { value: '100%', label: t('landing.stat_cloud', 'En la nube') },
        { value: '24/7', label: t('landing.stat_access', 'Acceso') },
        { value: '∞', label: t('landing.stat_projects', 'Proyectos') },
        { value: '0', label: t('landing.stat_complexity', 'Complejidad') }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 selection:bg-primary-500 selection:text-white">
            <Head title={t('app.name')} />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Control<span className="text-primary-600 dark:text-primary-400">App</span>
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#problems" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                                {t('landing.nav_problems', 'Problemas')}
                            </a>
                            <a href="#solutions" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                                {t('landing.nav_solutions', 'Soluciones')}
                            </a>
                            <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                                {t('landing.nav_features', 'Características')}
                            </a>
                            <a href="#how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                                {t('landing.nav_how_it_works', 'Cómo funciona')}
                            </a>

                            <ThemeToggle />

                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                                >
                                    {t('dashboard.title')}
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                                    >
                                        {t('auth.login')}
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                                    >
                                        {t('landing.cta_primary', 'Comenzar gratis')}
                                    </Link>
                                </>
                            )}
                        </nav>

                        {/* Mobile Navigation */}
                        <div className="flex md:hidden items-center space-x-3">
                            <ThemeToggle />
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium"
                                >
                                    {t('dashboard.title')}
                                </Link>
                            ) : (
                                <Link
                                    href={route('register')}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium"
                                >
                                    {t('landing.cta_primary', 'Comenzar')}
                                </Link>
                            )}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 text-gray-600 dark:text-gray-400"
                            >
                                {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
                            <a href="#problems" className="block py-2 text-gray-600 dark:text-gray-400 font-medium" onClick={() => setMobileMenuOpen(false)}>
                                {t('landing.nav_problems', 'Problemas')}
                            </a>
                            <a href="#solutions" className="block py-2 text-gray-600 dark:text-gray-400 font-medium" onClick={() => setMobileMenuOpen(false)}>
                                {t('landing.nav_solutions', 'Soluciones')}
                            </a>
                            <a href="#features" className="block py-2 text-gray-600 dark:text-gray-400 font-medium" onClick={() => setMobileMenuOpen(false)}>
                                {t('landing.nav_features', 'Características')}
                            </a>
                            <a href="#how-it-works" className="block py-2 text-gray-600 dark:text-gray-400 font-medium" onClick={() => setMobileMenuOpen(false)}>
                                {t('landing.nav_how_it_works', 'Cómo funciona')}
                            </a>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-primary-50/50 to-white dark:from-gray-900 dark:to-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            {t('landing.badge', 'Ahora en español')}
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            {t('landing.hero_title', 'Deja de perder tiempo')}
                            <br />
                            <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                                {t('landing.hero_title_accent', 'gestionando todo en hojas de cálculo')}
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                            {t('landing.hero_subtitle', 'ControlApp centraliza tus proyectos, finanzas, inventario y equipo en una sola plataforma. Sin complicaciones, sin tecnología innecesaria. Solo tú y tu negocio.')}
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">{stat.value}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href={route('register')}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all duration-200 text-lg shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
                            >
                                {t('landing.cta_primary', 'Comenzar gratis')}
                                <ArrowRightIcon className="w-5 h-5" />
                            </Link>
                            <a
                                href="#how-it-works"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-lg border border-gray-200 dark:border-gray-700"
                            >
                                {t('landing.cta_secondary', 'Mira cómo funciona')}
                            </a>
                        </div>

                        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                            {t('landing.cta_note', 'No se requiere tarjeta de crédito · Configuración en 2 minutos')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Problems Section */}
            <section id="problems" className="py-20 md:py-28 bg-gray-50 dark:bg-gray-800/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('landing.problems_title', 'Suena familiar?')}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            {t('landing.problems_subtitle', 'Estos son los problemas que escuchamos todos los días de emprendedores como tú')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {problems.map((problem, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-red-200 dark:hover:border-red-800/50 transition-all duration-300 group">
                                <div className="flex items-start gap-4">
                                    <span className="text-4xl">{problem.icon}</span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                            {problem.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {problem.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Solutions Section */}
            <section id="solutions" className="py-20 md:py-28 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('landing.solutions_title', 'La solución que necesitas')}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            {t('landing.solutions_subtitle', 'ControlApp está diseñado para resolver los problemas que realmente importan')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {solutions.map((solution, index) => (
                            <div key={index} className="relative bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-800 p-8 rounded-2xl border border-primary-100 dark:border-primary-900/50 hover:shadow-xl transition-all duration-300">
                                <div className="absolute top-4 right-4">
                                    <CheckCircleIcon className="w-8 h-8 text-primary-500" />
                                </div>
                                <div className="pr-10">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                        {solution.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                        {solution.description}
                                    </p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        {solution.highlight}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 md:py-28 bg-gray-50 dark:bg-gray-800/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('landing.features_title', 'Todo lo que necesitas')}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            {t('landing.features_subtitle', 'Módulos potentes que trabajan juntos para ti')}
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800/50 transition-all duration-300 group">
                                <div className="text-3xl mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-20 md:py-28 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('landing.how_it_works_title', 'Empieza en minutos')}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            {t('landing.how_it_works_subtitle', '4 pasos simples para tener todo bajo control')}
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {steps.map((step, index) => (
                            <div key={index} className="relative text-center">
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-200 to-primary-200 dark:from-primary-800 dark:to-primary-800" />
                                )}
                                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl text-white text-2xl font-bold mb-6 shadow-lg shadow-primary-500/25">
                                    {step.number}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-28 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {t('landing.cta_section_title', 'Listo para recuperar el control?')}
                        </h2>
                        <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
                            {t('landing.cta_section_subtitle', 'Únete a emprendedores que ya están gestionando sus negocios de manera inteligente. Sin contratos, sin complicaciones.')}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href={route('register')}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 text-lg shadow-lg"
                            >
                                {t('landing.cta_primary', 'Crear cuenta gratis')}
                                <ArrowRightIcon className="w-5 h-5" />
                            </Link>
                            <Link
                                href={route('docs.user')}
                                className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-400 transition-all duration-200 text-lg border border-primary-400"
                            >
                                {t('landing.cta_docs', 'Leer guías')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold">Control<span className="text-primary-400">App</span></span>
                        </div>

                        <nav className="flex flex-wrap justify-center gap-6 text-sm">
                            <Link href={route('docs.user')} className="text-gray-400 hover:text-white transition-colors">
                                {t('landing.footer_guide', 'Guía de inicio')}
                            </Link>
                            <Link href="/docs" className="text-gray-400 hover:text-white transition-colors">
                                {t('landing.footer_docs', 'Documentación')}
                            </Link>
                            <a href="mailto:soporte@controlapp.com" className="text-gray-400 hover:text-white transition-colors">
                                {t('landing.footer_support', 'Soporte')}
                            </a>
                        </nav>

                        <p className="text-gray-500 text-sm">
                            © {currentYear} ControlApp
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
