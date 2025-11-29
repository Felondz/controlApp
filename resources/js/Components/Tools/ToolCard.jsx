import React from 'react';
import PrimaryLink from '@/Components/PrimaryLink';
import { CheckCircleIcon } from '@/Components/Icons';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useTranslate } from '@/Hooks/useTranslate';

export default function ToolCard({ tool, isEnabled, onToggle }) {
    const { t } = useTranslate();
    const Icon = tool.icon;

    if (tool.disabled) {
        return (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 opacity-60 relative border border-gray-200 dark:border-gray-700">
                <div className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-500 text-xs font-bold px-2 py-1 rounded">
                    {t('common.coming_soon')}
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${tool.color} grayscale`}>
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{tool.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{tool.description}</p>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <SecondaryButton disabled className="w-full justify-center opacity-50 cursor-not-allowed">
                        {t('common.unavailable')}
                    </SecondaryButton>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 transition-all duration-200 border ${isEnabled ? 'border-primary-500 ring-1 ring-primary-500' : 'border-gray-200 dark:border-gray-700'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${tool.color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {isEnabled && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400">
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        {t('common.active')}
                    </span>
                )}
            </div>

            <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-400 mb-2">{tool.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 h-10">{tool.description}</p>

            <div className="grid grid-cols-2 gap-3">
                <PrimaryLink
                    href={route(tool.route)}
                    className={`justify-center ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    {t('common.open')}
                </PrimaryLink>

                {isEnabled ? (
                    <SecondaryButton
                        className="justify-center text-danger-600 hover:text-danger-700 dark:text-danger-400 dark:hover:text-danger-300 hover:bg-danger-50 dark:hover:bg-danger-900/20 border-danger-200 dark:border-danger-800"
                        onClick={() => onToggle(tool.id, false)}
                    >
                        {t('common.deactivate')}
                    </SecondaryButton>
                ) : (
                    <PrimaryButton
                        className="justify-center"
                        onClick={() => onToggle(tool.id, true)}
                    >
                        {t('common.activate')}
                    </PrimaryButton>
                )}
            </div>
        </div>
    );
}
