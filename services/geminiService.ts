import { GoogleGenAI, Type } from "@google/genai";

// Assurez-vous que process.env.API_KEY est défini dans votre environnement.
// Ne pas coder en dur la clé API ici.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("La clé API Gemini n'est pas définie. Les fonctionnalités IA ne fonctionneront pas.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function generateMenuIdeas(prompt: string): Promise<string> {
    if (!API_KEY) return "Erreur : Clé API non configurée.";
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "Tu es un chef cuisinier innovant et un mixologue expert. Tes réponses doivent être inspirantes, concises et formatées de manière claire avec des titres pour chaque idée.",
                temperature: 0.8,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Erreur lors de la génération d'idées de menu:", error);
        throw new Error("Impossible de générer des idées de menu.");
    }
}

export async function generateMenuDescription(prompt: string): Promise<string> {
    if (!API_KEY) return "Erreur : Clé API non configurée.";
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "Tu es un rédacteur culinaire spécialisé dans la création de descriptions de menus qui donnent faim. Utilise un langage évocateur et sensoriel.",
                 temperature: 0.7,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Erreur lors de la génération de la description de menu:", error);
        throw new Error("Impossible de générer la description.");
    }
}

export async function summarizeReviews(prompt: string): Promise<string> {
    if (!API_KEY) return "Erreur : Clé API non configurée.";
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "Tu es un analyste de données spécialisé dans les retours clients pour l'industrie de la restauration. Ton analyse doit être objective, structurée et orientée vers l'action.",
            },
        });
        return response.text;
    } catch (error) {
        console.error("Erreur lors du résumé des avis:", error);
        throw new Error("Impossible de résumer les avis.");
    }
}

export async function generateDailySummary(orders: string): Promise<string> {
    if (!API_KEY) return "Erreur : Clé API non configurée.";
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `En tant que consultant expert en gestion de restaurant, analyse les données de commande suivantes pour la journée et fournis un résumé concis et exploitable.

Données des commandes :
${orders}

Ton résumé doit inclure :
1.  Un aperçu des performances clés (revenu total, nombre de commandes).
2.  L'article ou la catégorie le plus populaire.
3.  Une observation ou une suggestion d'amélioration basée sur les données (par exemple, les heures de pointe, les articles peu vendus, etc.).

Rends le résumé facile à lire, en utilisant des points ou des titres.`,
            config: {
                systemInstruction: "Tu es un consultant en restauration qui fournit des informations claires, concises et exploitables à partir des données de vente.",
                temperature: 0.5,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Erreur lors de la génération du résumé quotidien:", error);
        throw new Error("Impossible de générer le résumé quotidien.");
    }
}

export async function generateSalesForecast(prompt: string): Promise<string> {
    if (!API_KEY) return "Erreur : Clé API non configurée.";
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "Tu es un analyste de données expert, spécialisé dans la prévision des ventes pour le secteur de la restauration. Tes prévisions sont basées sur des données et tes conseils sont pratiques et exploitables.",
                temperature: 0.6,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Erreur lors de la génération de la prévision des ventes:", error);
        throw new Error("Impossible de générer la prévision des ventes.");
    }
}

export async function generateMenuOptimizationAnalysis(prompt: string): Promise<string> {
    if (!API_KEY) return "Erreur : Clé API non configurée.";
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "Tu es un consultant en restauration de renommée mondiale. Ton expertise est de transformer les données de ventes en stratégies de menu rentables. Sois direct, clair et orienté vers l'action.",
                temperature: 0.6,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Erreur lors de la génération de l'analyse de menu:", error);
        throw new Error("Impossible de générer l'analyse de menu.");
    }
}
