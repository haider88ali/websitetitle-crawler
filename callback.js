const http = require('http');
const https = require('https');
const url = require('url');



function fetchTitle(address,callback){
let fullUrl = address.startsWith('http') ? address : 'http://' + address;
const lib = fullUrl.startsWith('https') ? https : http;

    lib.get(fullUrl,(res) => {
        let data = '';
        res.on('data',chunk => data += chunk);
        res.on('end' ,() => {
            const match = data.match(/<title>([^<]*)<\/title>/i);
            const title = match ? match[1] : 'NO RESPONSE';
            callback(null,{url:address,title});

        });
    }).on('error',() => {
        callback(null,{url:address,title:"No Url Found"});

    })

}

http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
//   return res.send("here");
    if (parsedUrl.pathname !== '/I/want/title') {
        res.writeHead(404);
        return res.end('<h1>404 Not Found</h1>');
  }

  const addresses = parsedUrl.query.address;
  const list = Array.isArray(addresses) ? addresses : [addresses];

  const results = [];
  let completed = 0;
  list.forEach((addresses,index) => {
    fetchTitle(addresses,(err,result) => {
        results[index] = result;
        completed++;
        if(completed == list.length)
        {
        res.writeHead(200,{'content-type' : 'text/html'})
        res.write('<html><body><h1>Following are the titles of given websites:</h1><ul>');
        results.forEach(r => res.write(`<li>${r.url} - " ${r.title}"`));
        res.end('</ul></body></html>')
        }
    })
  });
}).listen(3000, () => console.log('Callback version running at http://localhost:3000'));
