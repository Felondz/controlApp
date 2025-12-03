import { useState, useEffect, useCallback } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { CalculatorIcon, DocumentIcon, TableCellsIcon, ChevronDownIcon } from '@/Components/Icons';
import BasicMode from './Partials/BasicMode';
import AdvancedMode from './Partials/AdvancedMode';
import ToggleGroup from '@/Components/UI/ToggleGroup';
import Dropdown from '@/Components/Dropdown';
import axios from 'axios';
import debounce from 'lodash/debounce';
import html2canvas from 'html2canvas';

export default function FinancialCalculator({ auth }) {
    const { t } = useTranslate();

    // Mode State
    const [mode, setMode] = useState('basic'); // 'basic' | 'advanced'

    // Shared State
    const [amount, setAmount] = useState('');
    const [rate, setRate] = useState('');
    const [term, setTerm] = useState('');
    const [termType, setTermType] = useState('months');

    // Advanced State
    const [rateType, setRateType] = useState('EA'); // EA, NAMV, PM
    const [insurance, setInsurance] = useState('');

    // Results State
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    // Debounced Calculation
    const calculateLoan = useCallback(
        debounce(async (params) => {
            // Validate required fields
            if (!params.amount || !params.rate || !params.term) {
                setResults(null);
                return;
            }

            setLoading(true);
            try {
                const response = await axios.post(route('tools.calculator.calculate'), params);
                setResults(response.data);
            } catch (error) {
                console.error("Calculation error:", error);
            } finally {
                setLoading(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        calculateLoan({
            amount,
            rate,
            term,
            termType,
            rateType,
            insurance
        });
    }, [amount, rate, term, termType, rateType, insurance]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(value);
    };

    const handleExport = async (type) => {
        if (type === 'pdf') {
            // Capture Chart
            const chartElement = document.getElementById('amortization-chart');
            let chartImage = null;

            if (chartElement) {
                try {
                    const canvas = await html2canvas(chartElement, {
                        scale: 2,
                        backgroundColor: '#ffffff',
                        onclone: (clonedDoc) => {
                            const clonedChart = clonedDoc.getElementById('amortization-chart');
                            if (clonedChart) {
                                // Force white background and dark text
                                clonedChart.style.backgroundColor = '#ffffff';
                                clonedChart.style.color = '#111827';

                                // Fix SVG text colors (recharts uses fill)
                                const texts = clonedChart.getElementsByTagName('text');
                                for (let text of texts) {
                                    text.style.fill = '#374151';
                                }

                                // Fix SVG stroke colors (lines, grid) if they are too light
                                const paths = clonedChart.getElementsByTagName('path');
                                for (let path of paths) {
                                    const stroke = window.getComputedStyle(path).stroke;
                                    // If stroke is white/light, make it dark
                                    if (stroke === 'rgb(255, 255, 255)' || stroke === '#ffffff') {
                                        path.style.stroke = '#374151';
                                    }
                                }
                            }
                        }
                    });
                    chartImage = canvas.toDataURL('image/png');
                } catch (error) {
                    console.error("Error capturing chart:", error);
                }
            }

            // Use POST for PDF to include image data
            try {
                const response = await axios.post(route('tools.calculator.export.pdf'), {
                    amount,
                    rate,
                    term,
                    termType,
                    rateType,
                    insurance,
                    chartImage
                }, {
                    responseType: 'blob'
                });

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'proyeccion-credito.pdf');
                document.body.appendChild(link);
                link.click();
                link.remove();
            } catch (error) {
                console.error("Export error:", error);
            }
        } else {
            // CSV (GET)
            const params = new URLSearchParams({
                amount,
                rate,
                term,
                termType,
                rateType,
                insurance
            }).toString();

            const url = route(`tools.calculator.export.${type}`) + '?' + params;
            window.open(url, '_blank');
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={null} // Custom header inside the page
        >
            <Head title={t('dashboard.calculator', 'Calculadora Financiera')} />

            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans selection:bg-primary-500/30">
                {/* Header & Toggle */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-4 sm:pb-6">
                    <div className="flex flex-col gap-4">
                        {/* Title Section */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <CalculatorIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary-600 dark:text-primary-400">
                                    {t('dashboard.calculator', 'Calculadora Financiera')}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                                    {t('calculator.subtitle', 'Proyecta tus créditos con precisión')}
                                </p>
                            </div>
                        </div>

                        {/* Controls Section */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                            {/* Mode Toggle Switch */}
                            <div className="flex-1">
                                <ToggleGroup
                                    value={mode}
                                    onChange={setMode}
                                    options={[
                                        { label: t('calculator.basic_mode', 'Básico'), value: 'basic' },
                                        { label: t('calculator.advanced_mode', 'Avanzado'), value: 'advanced' },
                                    ]}
                                />
                            </div>

                            {/* Export Dropdown */}
                            {results && (
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md w-full sm:w-auto">
                                            <button
                                                type="button"
                                                className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {t('common.export', 'Exportar')}
                                                <ChevronDownIcon className="ml-2 -mr-0.5 h-4 w-4" />
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content width="48">
                                        <button
                                            onClick={() => handleExport('csv')}
                                            className="w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 focus:outline-none transition duration-150 ease-in-out flex items-center gap-2"
                                        >
                                            <TableCellsIcon className="w-4 h-4 text-emerald-500" />
                                            CSV (Excel)
                                        </button>
                                        <button
                                            onClick={() => handleExport('pdf')}
                                            className="w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 focus:outline-none transition duration-150 ease-in-out flex items-center gap-2"
                                        >
                                            <DocumentIcon className="w-4 h-4 text-red-500" />
                                            PDF
                                        </button>
                                    </Dropdown.Content>
                                </Dropdown>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-gray-700/50 shadow-xl overflow-hidden min-h-[400px] sm:min-h-[600px] p-4 sm:p-8 relative">
                        {loading && (
                            <div className="absolute top-4 right-4 z-50">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                            </div>
                        )}

                        {mode === 'basic' ? (
                            <BasicMode
                                amount={amount} setAmount={setAmount}
                                rate={rate} setRate={setRate}
                                term={term} setTerm={setTerm}
                                termType={termType} setTermType={setTermType}
                                results={results}
                                formatCurrency={formatCurrency}
                            />
                        ) : (
                            <AdvancedMode
                                amount={amount} setAmount={setAmount}
                                rate={rate} setRate={setRate}
                                term={term} setTerm={setTerm}
                                termType={termType} setTermType={setTermType}
                                rateType={rateType} setRateType={setRateType}
                                insurance={insurance} setInsurance={setInsurance}
                                results={results}
                                formatCurrency={formatCurrency}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
