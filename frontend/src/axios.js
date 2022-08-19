import axios from 'axios'

const axiosInstance = axios.create()

axiosInstance.defaults.baseURL = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_PATH
axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {        
        return Promise.reject(
            (error.response && error.response.data) || 'Something went wrong!'
        )
    }
)

export default axiosInstance
