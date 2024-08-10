// ccip.js                                                                                                              
function getTodayToken() {                                                                                              
    const today = new Date();                                                                                              
    const yyyy = today.getUTCFullYear();                                                                                   
    let mm = today.getUTCMonth() + 1; // getUTCMonth() is zero-indexed                                                     
    let dd = today.getUTCDate();                                                                                           
    mm = mm < 10 ? '0' + mm : mm;                                                                                          
    dd = dd < 10 ? '0' + dd : dd;                                                                                          
    return `${yyyy}${mm}${dd}`;                                                                                            
}                                                                                                                          
                                                                                                                           
async function fetchCCIP(url, token) {                                                                                          
    let resp = await fetch(`${url}?token=${token}`);                                      
    if (resp.ok) {                                                                                                         
        let data = await resp.json();                                                                                      
        return data['ccip'];                                                                                               
    } else {                                                                                                               
        throw new Error('Server responded with an error!');                                                                
    }                                                                                                                      
}                                                                                                                          
                                                                                                                           
async function getCCIPWithCache(url, token) {                                                                                   
    const cacheKey = `ccip_address`;                                                                                       
    const cachedCCIP = localStorage.getItem(cacheKey);                                                                     
    if (cachedCCIP) {                                                                                                      
        return cachedCCIP;                                                                                                 
    }                                                                                                                      
                                                                                                                           
    let attempts = 3;                                                                                                      
    let backoff = 1000;                                                                                                    
                                                                                                                           
    while (attempts > 0) {                                                                                                 
        try {                                                                                                              
            const ccip = await fetchCCIP(url, token);                                                                           
            localStorage.setItem(cacheKey, ccip);                                                                          
            return ccip;                                                                                                   
        } catch (error) {                                                                                                  
            attempts--;                                                                                                    
            if (attempts === 0) {                                                                                          
                throw new Error('Failed to fetch CCIP after multiple attempts.');                                          
            }                                                                                                              
            await new Promise(resolve => setTimeout(resolve, backoff));                                                    
            backoff *= 2; // Exponential backoff                                                                           
        }                                                                                                                  
    }                                                                                                                      
}                                                                                                                          
                                                                                                                           
export { getTodayToken, fetchCCIP, getCCIPWithCache };
