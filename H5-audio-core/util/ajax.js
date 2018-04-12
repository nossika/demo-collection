window.ajax = config => {
    let method = (config.method || 'GET').toUpperCase();
    let url = config.url;
    let data = config.data || {};
    let header = config.header || {};
    let callback = config.callback || function(){};

    try{
        let XHR = new XMLHttpRequest();

        let data_arr = [];
        for (let key in data) data_arr.push(key + '=' + data[key]);
        let data_str = data_arr.join('&');

        let body;
        if (method === 'GET'){
            url += url.includes('?') ? '' :
                data_str ?  '' : '?' + data_str;
            XHR.open(method, url);
            body = null;
        } else if (method === 'POST'){
            XHR.open(method, url);
            let is_formdata = typeof FormData === "function" && data instanceof FormData;
            body = is_formdata ? data : data_str;
            if (!is_formdata) {
                XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
        } else {
            throw 'only get/post available';
        }
        for (let i in header) {
            XHR.setRequestHeader(i, header[i]);
        }
        XHR.onreadystatechange = function (){
            if (XHR.readyState === 4) {
                callback(XHR.responseText,XHR.status);
            }
        };

        XHR.send(body);
    }catch (e){
        console.log(e);
    }
};