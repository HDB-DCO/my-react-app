import axios from 'axios';

export default axios.create({
    // Possible URL: onrender.com
    baseURL: "http://localhost:5000" //http://3.86.223.44:5000
    // withCredentials: true
});