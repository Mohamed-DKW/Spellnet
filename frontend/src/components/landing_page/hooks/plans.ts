import type { Plan } from '../types/Plan';

const plans: Plan[] = [
    {
        name: 'Goblin',
        price: 'Gratis',
        period: '/ mes',
        image: '/public/img/icono-goblin.png',
        benefits: [
            { icon: '✓', text: '10 mensajes diarios' },
            { icon: '✓', text: '1 archivo diario' },
        ],
        classes: {
            title: 'text-green-700',
            glow: '[text-shadow:0_0_8px_rgba(34,197,94,0.4)]',
            glowStrong: '[text-shadow:0_0_12px_rgba(34,197,94,0.6)]',
            border: 'border-green-600',
            btnBg: 'bg-green-700',
            btnBorder: 'border-green-600',
            btnHover: 'hover:bg-green-800',
            price: 'text-green-900',
        },
    },
    {
        name: 'Wizard',
        price: '$20',
        period: '/ mes',
        image: '/public/img/icono-wizard.png',
        benefits: [
            { icon: '✓', text: '30 mensajes diarios' },
            { icon: '✓', text: 'Hasta 5 archivos diarios' },
        ],
        classes: {
            title: 'text-violet-700',
            glow: '[text-shadow:0_0_8px_rgba(139,92,246,0.4)]',
            glowStrong: '[text-shadow:0_0_12px_rgba(139,92,246,0.6)]',
            border: 'border-violet-500',
            btnBg: 'bg-violet-700',
            btnBorder: 'border-violet-500',
            btnHover: 'hover:bg-violet-800',
            price: 'text-violet-900',
        },
        popular: true,
    },
    {
        name: 'Elder Dragon',
        price: '$50',
        period: '/ mes',
        image: '/public/img/icono-dragon.png',
        benefits: [
            { icon: '✓', text: 'Mensajes ilimitados' },
            { icon: '✓', text: 'Archivos ilimitados' },
        ],
        classes: {
            title: 'text-red-600',
            glow: '[text-shadow:0_0_8px_rgba(239,68,68,0.4)]',
            glowStrong: '[text-shadow:0_0_12px_rgba(239,68,68,0.6)]',
            border: 'border-red-500',
            btnBg: 'bg-red-600',
            btnBorder: 'border-red-500',
            btnHover: 'hover:bg-red-700',
            price: 'text-red-900',
        },
    },
];

export default plans;