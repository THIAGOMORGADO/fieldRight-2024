import Axios from "axios"


const ApiBase =  Axios.create({
    baseURL: process.env.apiBase
})


const prodUrl = Axios.create({
    baseURL: process.env.ProdUrl
})

export {ApiBase, prodUrl};
