import { Link } from 'react-router-dom';
import plans from '../hooks/plans';

export default function PlansSection() {
    return (
        <section id="planes" className="w-full py-20 px-4 bg-black">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-amber-100 text-center mb-4 section-title-glow">
                    Elige tu Clase
                </h2>
                <p className="text-amber-600 text-center mb-16 text-lg max-w-2xl mx-auto">
                    Cada aventurero tiene su camino. ¿Cuál es el tuyo?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-end px-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`pergamino ${plan.popular ? 'popular-plan' : ''}`}
                        >
                            {plan.popular && (
                                <div className="popular-badge">POPULAR</div>
                            )}
                            <div className="pergamino-roll-left"></div>
                            <div className="pergamino-roll-right"></div>
                            <div className="pergamino-inner">
                                <div className="flex justify-center mb-4">
                                    <img
                                        src={plan.image}
                                        alt={plan.name}
                                        className={`object-contain ${plan.classes.glowStrong} ${
                                            plan.popular
                                                ? 'w-[37.04mm] h-[37.04mm]'
                                                : 'w-[29.63mm] h-[29.63mm]'
                                        }`}
                                    />
                                </div>
                                <h3 className={`text-2xl font-bold text-center mb-1 ${plan.classes.title} ${plan.classes.glow}`}>
                                    {plan.name}
                                </h3>
                                <div className="text-center mb-5">
                                    <span className={`text-3xl font-black ${plan.classes.price} ${plan.classes.glow}`}>
                                        {plan.price}
                                    </span>
                                    <span className="text-sm text-[#5d4037]"> {plan.period}</span>
                                </div>
                                <div className={`w-3/4 mx-auto h-px mb-5 ${plan.classes.border}`}></div>
                                <ul className="space-y-3 mb-6">
                                    {plan.benefits.map((b, i) => (
                                        <li key={i} className="flex items-start text-sm">
                                            <span className={`mr-3 font-bold text-lg ${plan.classes.title} ${plan.classes.glow}`}>
                                                {b.icon}
                                            </span>
                                            <span className={`font-medium ${plan.classes.title}`}>
                                                {b.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to="/signup"
                                    state={{ selectedPlan: plan.name.toLowerCase().replace(/\s+/g, '-') }}
                                    className={`plan-btn ${plan.classes.btnBg} ${plan.classes.btnBorder} ${plan.classes.btnHover} text-white`}
                                >
                                    Comenzar Aventura
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}