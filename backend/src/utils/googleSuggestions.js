import axios from 'axios'
export const fetchSuggestions = async (req,res) => {
    const {input} =  req.query
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${process.env.googleMapsApiKey}`;
    try {
        const response = await axios.get(url)
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
