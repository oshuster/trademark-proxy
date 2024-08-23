import axios from "axios";

export const getTrademark = async (req, res) => {
  try {
    const { q } = req.query;

    const response = await axios.get(
      "https://iprop-ua.com/api/parts/tm-search-results/",
      {
        params: { q },
        // headers: {
        //   Accept: "*/*",
        //   "Accept-Encoding": "gzip, deflate, br",
        //   Connection: "keep-alive",
        //   Referer: `https://iprop-ua.com/api/parts/tm-search-results?q=${q}`,
        //   Host: "iprop-ua.com",
        // },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: "Error fetching data" });
  }
};
