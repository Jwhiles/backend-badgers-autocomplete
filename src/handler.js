'use strict';
const handler = module.exports = {};
const fs = require('fs');
const path = require('path');
const url = require('url');
const search = require('./search');

handler.home = function (request, response) {
  fs.readFile(path.join(__dirname, '../public/index.html'), function (err, data) {
    if (err) {
      console.log(err);
      return;
    }
    response.writeHead(200, {'Content-type': 'text/html'});
    response.write(data);
    response.end();
  });
};

// File requests
handler.files = function (request, response, url) {
  fs.readFile(path.join(__dirname, '../public', url), 'utf8', function (err, file) {
    if (err) throw err;
    var ext = path.extname(url).slice(1);
    response.writeHead(200, {'content-type': 'text/' + ext});
    response.end(file);
  });
};

handler.notFound = function (request, response) {
  response.writeHead(404, {'Content-type': 'text/html'});
  response.end('<h1>Resource not found</h1>');
};

handler.dict = function (request, response) {
  let urlParts = url.parse(request.url, true); // eg dict/en?lang=en&search=hello
  let lang = (urlParts.query.lang || 'en');
  let searchTerm = urlParts.query.search;
  if (!searchTerm) {
    return;
  }
  search.find(searchTerm, lang, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      response.writeHead(200, {'Content-type': 'text/json'});
      response.end(data);
    }
  });
};
