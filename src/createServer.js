/* eslint-disable max-len */
// Write code here
// Also, you can create additional files in the src folder
// and import (require) them here

const http = require('http');
const { convertToCase } = require('./convertToCase/convertToCase');

const createServer = () => {
  const server = http.createServer((req, res) => {
    const cases = ['SNAKE', 'KEBAB', 'CAMEL', 'PASCAL', 'UPPER'];

    res.setHeader('Content-Type', 'application/json');

    const normalizeURL = new URL(req.url, 'http://localhost:5700');

    const params = normalizeURL.searchParams.get('toCase');
    const text = normalizeURL.pathname.slice(1);
    const errors = [];
    const textError = {
      message:
        'Text to convert is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
    };
    const caseError = {
      message:
        '"toCase" query param is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
    };
    const paramsError = {
      message:
        'This case is not supported. Available cases: SNAKE, KEBAB, CAMEL, PASCAL, UPPER.',
    };

    if (text.length < 1) {
      res.statusCode = 400;

      errors.push(textError);
    }

    if (params === null) {
      res.statusCode = 400;

      errors.push(caseError);
    } else if (!cases.includes(params)) {
      res.statusCode = 400;

      errors.push(paramsError);
    }

    if (errors.length > 0) {
      res.end(JSON.stringify({ errors }));

      return;
    }

    const newParams = convertToCase(text, params);

    const response = {
      originalCase: newParams.originalCase,
      targetCase: params,
      originalText: text,
      convertedText: newParams.convertedText,
    };

    res.statusCode = 200;
    res.write(JSON.stringify(response));
    res.end();
  });

  return server;
};

module.exports.createServer = createServer;
