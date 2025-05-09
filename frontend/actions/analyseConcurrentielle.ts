import getCookies from "./getCookies";
const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000/api';

export const getCompetitors = async () => {
    const response = await fetch(
        `${backendUrl}/competitor/competitors`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${getCookies()}`,
            }
        }
    );
    if (!response.ok) {
        throw new Error('Failed to fetch competitors data');
    }
    const data = await response.json();
    console.log(data);
    return data.map((competitor: { _id: string; name: string }) => ({
        id: competitor._id,
        name: competitor.name,
    }));
};