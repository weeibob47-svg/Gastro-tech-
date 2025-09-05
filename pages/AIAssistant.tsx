import React, { useState } from 'react';
import { generateMenuDescription, generateMenuIdeas, summarizeReviews, generateSalesForecast, generateMenuOptimizationAnalysis } from '../services/geminiService';
import { MOCK_ORDERS, MOCK_MENU_ITEMS } from '../services/mockData';

type AiFeature = 'ideas' | 'description' | 'reviews' | 'forecast' | 'optimization';

const Spinner: React.FC = () => (
    <div className="border-4 border-bunker-700 border-t-amber-500 rounded-full w-6 h-6 animate-spin"></div>
);

const AIAssistant: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AiFeature>('ideas');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>('');
    const [error, setError] = useState<string>('');

    // State for inputs
    const [ideaInput, setIdeaInput] = useState<string>('cocktail d\'été');
    const [descInput, setDescInput] = useState<string>('Salade César au poulet grillé');
    const [reviewsInput, setReviewsInput] = useState<string>('Le service était incroyable, mais mon plat était un peu froid.\nLa musique était trop forte, mais les cocktails étaient divins !\nMeilleur burger que j\'ai jamais mangé.');
    const [forecastInput, setForecastInput] = useState<string>('la semaine prochaine');
    
    const [prompts, setPrompts] = useState({
        ideas: 'Génère 3 idées créatives de plats ou de boissons pour un restaurant sur le thème "{{theme}}". Pour chaque idée, donne un nom accrocheur, une brève description et les ingrédients clés.',
        description: 'Rédige une description de menu alléchante et concise (environ 30-40 mots) pour un plat nommé "{{dishName}}". Mets en valeur les saveurs et les ingrédients de qualité.',
        reviews: `Voici une liste d'avis de clients pour un restaurant. Analyse-les et fournis un résumé concis. Le résumé doit inclure :\n1.  Les points positifs récurrents.\n2.  Les points négatifs récurrents.\n3.  Une suggestion d'amélioration exploitable.\n\nAvis :\n{{reviews}}`,
        forecast: `En tant qu'analyste de données senior pour une chaîne de restaurants, analyse les données de ventes historiques suivantes et génère une prévision des ventes pour {{period}}.\n\nDonnées de ventes historiques (horodatages, articles, totaux) :\n{{orders}}`,
        optimization: `En tant que consultant expert en restauration spécialisé en "menu engineering", analyse la liste des plats du menu et l'historique des commandes fournis ci-dessous.

**Menu Actuel :**
{{menuItems}}

**Historique des Commandes :**
{{orders}}

Fournis une analyse stratégique complète et exploitable. Ta réponse doit être structurée comme suit, en utilisant le markdown :

### Analyse d'Optimisation du Menu

**1. Vos "Stars" (Haute popularité)**
   - Liste les plats qui sont fréquemment commandés. Ce sont les piliers de ton menu.

**2. Vos "Dilemmes" (Basse popularité)**
   - Liste les plats qui sont rarement commandés.
   - Pour chaque plat, suggère une action : le reformuler, mieux le positionner sur le menu, ou former le personnel pour le recommander.

**3. Vos "Poids Morts" (À reconsidérer)**
   - Identifie les plats qui ne se vendent presque jamais. Suggère de les retirer du menu pour simplifier les opérations et réduire les coûts.

**4. Recommandations Stratégiques**
   - Fournis 2 à 3 conseils clairs et concis pour améliorer la rentabilité globale du menu. Par exemple, suggérer une promotion croisée, un ajustement de prix mineur sur une "Star", ou la création d'un menu dégustation.
`,
    });

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompts(prev => ({
            ...prev,
            [activeTab]: e.target.value,
        }));
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        setResult('');

        try {
            let response;
            let finalPrompt = prompts[activeTab];

            if (activeTab === 'ideas') {
                finalPrompt = finalPrompt.replace('{{theme}}', ideaInput);
                response = await generateMenuIdeas(finalPrompt);
            } else if (activeTab === 'description') {
                finalPrompt = finalPrompt.replace('{{dishName}}', descInput);
                response = await generateMenuDescription(finalPrompt);
            } else if (activeTab === 'reviews') {
                finalPrompt = finalPrompt.replace('{{reviews}}', reviewsInput);
                response = await summarizeReviews(finalPrompt);
            } else if (activeTab === 'forecast') {
                const ordersString = JSON.stringify(MOCK_ORDERS.map(o => ({
                    total: o.total,
                    items: o.items.map(i => i.name),
                    timestamp: o.timestamp
                })), null, 2);
                finalPrompt = finalPrompt.replace('{{orders}}', ordersString).replace('{{period}}', forecastInput);
                response = await generateSalesForecast(finalPrompt);
            } else if (activeTab === 'optimization') {
                const menuItemsString = JSON.stringify(MOCK_MENU_ITEMS.map(i => ({ name: i.name, price: i.price, category: i.category })), null, 2);
                const ordersString = JSON.stringify(MOCK_ORDERS.map(o => ({ items: o.items.map(i => i.name) })), null, 2);
                 finalPrompt = finalPrompt.replace('{{menuItems}}', menuItemsString).replace('{{orders}}', ordersString);
                response = await generateMenuOptimizationAnalysis(finalPrompt);
            }
            setResult(response as string);
        } catch (err: any) {
            setError('Une erreur est survenue lors de la communication avec l\'IA. Veuillez réessayer.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const CustomPromptEditor: React.FC<{placeholder: string}> = ({placeholder}) => (
        <details className="mt-6">
            <summary className="cursor-pointer text-sm text-bunker-400 hover:text-white">Personnaliser le prompt</summary>
            <p className="text-xs text-bunker-500 mt-1 mb-2">Modifiez le modèle ci-dessous. Utilisez des doubles accolades pour les variables (ex: {placeholder}).</p>
            <textarea
                value={prompts[activeTab]}
                onChange={handlePromptChange}
                rows={8}
                className="w-full bg-bunker-950 p-3 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono"
            />
        </details>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'ideas':
                return (
                    <div>
                        <label htmlFor="ideaInput" className="block text-sm font-medium text-bunker-300 mb-2">Thème ou ingrédient principal</label>
                        <input
                            type="text"
                            id="ideaInput"
                            value={ideaInput}
                            onChange={(e) => setIdeaInput(e.target.value)}
                            placeholder="Ex: plat végétarien, dessert au chocolat"
                            className="w-full bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <CustomPromptEditor placeholder="{{theme}}" />
                    </div>
                );
            case 'description':
                return (
                    <div>
                        <label htmlFor="descInput" className="block text-sm font-medium text-bunker-300 mb-2">Nom du plat</label>
                        <input
                            type="text"
                            id="descInput"
                            value={descInput}
                            onChange={(e) => setDescInput(e.target.value)}
                            placeholder="Ex: Burger Gourmet, Mojito Royal"
                            className="w-full bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                         <CustomPromptEditor placeholder="{{dishName}}" />
                    </div>
                );
            case 'reviews':
                return (
                    <div>
                        <label htmlFor="reviewsInput" className="block text-sm font-medium text-bunker-300 mb-2">Collez les avis clients (un par ligne)</label>
                        <textarea
                            id="reviewsInput"
                            value={reviewsInput}
                            onChange={(e) => setReviewsInput(e.target.value)}
                            rows={8}
                            className="w-full bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <CustomPromptEditor placeholder="{{reviews}}" />
                    </div>
                );
            case 'forecast':
                return (
                    <div>
                        <label htmlFor="forecastInput" className="block text-sm font-medium text-bunker-300 mb-2">Période pour la prévision</label>
                        <input
                            type="text"
                            id="forecastInput"
                            value={forecastInput}
                            onChange={(e) => setForecastInput(e.target.value)}
                            placeholder="Ex: le week-end prochain, le mois de décembre"
                            className="w-full bg-bunker-800 p-2 rounded text-white placeholder-bunker-500 border border-bunker-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <p className="text-xs text-bunker-500 mt-2">Note: Les données de ventes sont fournies automatiquement à l'IA.</p>
                        <CustomPromptEditor placeholder="{{period}} et {{orders}}" />
                    </div>
                );
            case 'optimization':
                return (
                    <div>
                        <div className="text-center bg-bunker-800/50 p-4 rounded-lg">
                            <p className="text-bunker-300">
                                L'IA analysera vos données de ventes et votre menu pour identifier les plats les plus performants, ceux à améliorer, et vous fournira des recommandations stratégiques pour augmenter votre rentabilité.
                            </p>
                        </div>
                        <CustomPromptEditor placeholder="{{menuItems}} et {{orders}}" />
                    </div>
                )
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Assistant IA</h1>
            <p className="text-bunker-300 mb-8">Utilisez l'intelligence artificielle pour stimuler votre créativité et améliorer votre service.</p>

            <div className="bg-bunker-900 rounded-lg p-6 sm:p-8 border border-bunker-800 shadow-xl">
                <div className="border-b border-bunker-800 mb-6">
                    <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto pb-1" aria-label="Tabs">
                        <button onClick={() => { setActiveTab('ideas'); setResult('')}} className={`${activeTab === 'ideas' ? 'border-amber-500 text-amber-500' : 'border-transparent text-bunker-400 hover:text-white'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>Idées de Menu</button>
                        <button onClick={() => { setActiveTab('description'); setResult('')}} className={`${activeTab === 'description' ? 'border-amber-500 text-amber-500' : 'border-transparent text-bunker-400 hover:text-white'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>Rédacteur de Description</button>
                        <button onClick={() => { setActiveTab('reviews'); setResult('')}} className={`${activeTab === 'reviews' ? 'border-amber-500 text-amber-500' : 'border-transparent text-bunker-400 hover:text-white'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>Analyse d'Avis</button>
                        <button onClick={() => { setActiveTab('forecast'); setResult('')}} className={`${activeTab === 'forecast' ? 'border-amber-500 text-amber-500' : 'border-transparent text-bunker-400 hover:text-white'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>Prévisions de Ventes</button>
                        <button onClick={() => { setActiveTab('optimization'); setResult('')}} className={`${activeTab === 'optimization' ? 'border-amber-500 text-amber-500' : 'border-transparent text-bunker-400 hover:text-white'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>Optimisation de Menu</button>
                    </nav>
                </div>

                <div className="space-y-6">
                    {renderContent()}
                    <button onClick={handleGenerate} disabled={loading} className={`w-full flex justify-center items-center space-x-3 bg-amber-600 text-white px-4 py-3 rounded-md hover:bg-amber-500 transition-colors disabled:bg-bunker-700 disabled:cursor-not-allowed mt-4 ${loading ? 'animate-pulse' : ''}`}>
                        {loading && <Spinner />}
                        <span>{loading ? 'Analyse en cours...' : 'Générer'}</span>
                    </button>
                </div>
                
                {(result || error) && (
                    <div className="mt-8 pt-6 border-t border-bunker-800">
                        <h3 className="text-xl font-semibold text-white mb-4">Résultat de l'Analyse</h3>
                        {error && <p className="text-red-400 bg-red-500/10 p-4 rounded-md">{error}</p>}
                        {result && (
                            <div className="bg-bunker-950 p-4 rounded-md prose prose-invert prose-p:text-bunker-300 prose-headings:text-amber-500 prose-strong:text-white max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-bunker-200">{result}</pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIAssistant;