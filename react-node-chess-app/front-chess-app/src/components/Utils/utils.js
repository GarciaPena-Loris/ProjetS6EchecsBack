import axios from "axios";
import { decodeToken } from "react-jwt";


export async function getActualGlobalElo() {
    try {
        if (!sessionStorage.token) {
            console.log("no token");
            return null;
        }
        const decoded = decodeToken(sessionStorage.token);
        const name = decoded.name;
        // get elo
        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `http://localhost:3001/users/globalElo/${name}`,
            headers: {
                'Authorization': `Bearer ${sessionStorage.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        };
        axios(config)
            .then(function (response) {
                console.log("🚀 ~ file: utils.js:23 ~ response.data.global_elo:", response.data.global_elo)
                return response.data.global_elo;
            })
            .catch(function (error) {
                console.log(error.response);
            });
    }
    catch (error) {
        console.log(error);
    }
}