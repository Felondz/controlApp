import { Head, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import ThemeToggle from '@/Components/ThemeToggle';
// Inline icons for guide steps
const StepIcon = ({ colorClass }) => (
    <svg className={`w-8 h-8 text-${colorClass}-600 dark:text-${colorClass}-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const StepCard = ({ number, title, steps, colorClass }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
        <div className={`h-2 bg-${colorClass}-500`} />
        <div className="p-8">
            <div className="flex items-center mb-6">
                <span className={`flex items-center justify-center w-12 h-12 rounded-full bg-${colorClass}-100 dark:bg-${colorClass}-900/30 text-${colorClass}-600 dark:text-${colorClass}-400 font-bold text-xl mr-4`}>
                    {number}
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h3>
            </div>
            <div className="space-y-4">
                {steps.map((step, idx) => (
                    <div key={idx} className="flex items-start">
                        <div className={`mt-1 min-w-[20px] h-5 w-5 rounded-full border-2 border-${colorClass}-200 dark:border-${colorClass}-800 flex items-center justify-center mr-3`}>
                            <div className={`w-2.5 h-2.5 rounded-full bg-${colorClass}-500`} />
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {step}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default function UserGuide() {
    const { t } = useTranslate();

    const guideSteps = [
        {
            title: t('docs.steps.project_create_title'),
            color: 'primary',
            steps: [
                t('docs.steps.project_create_step1'),
                t('docs.steps.project_create_step2'),
                t('docs.steps.project_create_step3'),
            ]
        },
        {
            title: t('docs.steps.finance_add_title'),
            color: 'success',
            steps: [
                t('docs.steps.finance_add_step1'),
                t('docs.steps.finance_add_step2'),
                t('docs.steps.finance_add_step3'),
            ]
        },
        {
            title: t('docs.steps.team_invite_title'),
            color: 'info',
            steps: [
                t('docs.steps.team_invite_step1'),
                t('docs.steps.team_invite_step2'),
                t('docs.steps.team_invite_step3'),
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 selection:bg-primary-500 selection:text-white">
            <Head title={t('docs.user_guide_title')} />

            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-10 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link href={route('docs.index')} className="group flex items-center text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 mr-2 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </div>
                            <span className="font-medium hidden sm:inline">{t('common.back')}</span>
                        </Link>
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('docs.user_guide_title')}
                        </h1>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">

                    {/* Hero Intro */}
                    <div className="text-center mb-16">
                        <span className="inline-block py-1 px-3 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold mb-4 tracking-wide uppercase">
                            {t('docs.hub_title')}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                            {t('docs.user_guide_intro_title')}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            {t('docs.user_guide_intro_desc')}
                        </p>
                    </div>

                    {/* Steps Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {guideSteps.map((guide, index) => (
                            <StepCard
                                key={index}
                                number={index + 1}
                                title={guide.title}
                                steps={guide.steps}
                                colorClass={guide.color}
                            />
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-primary-900 dark:to-primary-800 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-white mb-6">
                                {t('docs.cta.start_title')}
                            </h3>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link href={route('register')} className="px-8 py-3 bg-primary-500 hover:bg-primary-400 text-white font-bold rounded-xl transition-all shadow-lg transform hover:-translate-y-0.5">
                                    {t('docs.cta.create_account')}
                                </Link>
                                <Link href={route('login')} className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl transition-all border border-white/20">
                                    {t('docs.cta.login')}
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
