const Http = require('./http')
require('../polyfills/url')



module.exports = (method, url, body, headers) => {
    Http.validateMethod(method)
    URL.validate(url)

    return (async()=>{
        try{
            const resp = await fetch(url,{method,headers,body})
            const _body = await resp.text()
    
            return await {status: resp.status,body:_body}
        }catch(error){
        
            throw new Error(error)
        }
     
    })()
}