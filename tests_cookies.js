var http = require('http');

/*function parseCookies(cookie) {
    return cookie.split('; ').reduce(
        function(prev, curr) {
            var m = / *([^=]+)=(.*)/.exec(curr);
            var key = m[1];
            var value = decodeURIComponent(m[2]);
            prev[key] = value;
            return prev;
        },
        { }
    );
}*/

function parseCookies(request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split('; ').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

function stringifyCookies(cookies) {
    var list = [ ];
    for (var key in cookies) {
        list.push(key + '=' + cookies[key]);
    }
    return list;
}

http.createServer(function (request, response) {
  console.log(request.headers.cookie);
  var cookies = parseCookies(request);
  console.log('Input cookies: ', cookies);
  cookies.search = 'google';
  if (cookies.counter){
    cookies.counter++;
    cookies.counter += "; expires="+new Date(new Date().getTime()+1000*10).toUTCString();
    console.log('cookie counter ' + cookies.counter);
  }
  else
    cookies.counter = 1;
  cookies.mycookie = 'worx';
  cookies.test = '123';
  console.log('Output cookies: ', cookies);
  console.log('Stringified cookies: ', stringifyCookies(cookies));
  response.writeHead(200, {
    'Set-Cookie': stringifyCookies(cookies),
    'Content-Type': 'text/plain'
  });
  response.end('Hello World\n');
}).listen(8080);