'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  // Function taken from https://newbedev.com/express-logging-response-body
  function logResponseBody(req, res, next) {
    var oldWrite = res.write,
        oldEnd = res.end;
  
    var chunks = [];
  
    res.write = function (chunk) {
      chunks.push(chunk);
  
      return oldWrite.apply(res, arguments);
    };
  
    res.end = function (chunk) {
      if (chunk)
        chunks.push(chunk);
  
      var body = Buffer.concat(chunks).toString('utf8');
      console.log(req.path, body);
  
      oldEnd.apply(res, arguments);
    };
  
    next();
  }

  function logRequestInfo(req, res, next) {
    console.log('Request Type: ', req.method);
    console.log('Request Data Sent: ', req.body);

    next();
  }
  
  //app.use(logResponseBody);
  //app.use(logRequestInfo);

  app.route('/api/translate')
    .post((req, res) => {
      const locale = req.body.locale || req.query.locale;
      let text = req.body.text;
      if (req.query.text === "") text = "";

      //console.log("locale: ", locale);
      //console.log("text: ", text);
      //console.log("type of text: ", typeof text);

      let targetAmerican;

      // Guard statements for incorrect input in the post request 
      if (text == undefined || locale == undefined) {
        return res.json({ error: "Required field(s) missing" });
      }
      if (typeof text === "string" && text.length === 0) {
        return res.json({ error: "No text to translate" });
      }
      if (locale !== "british-to-american" && locale !== "american-to-british") {
        return res.json({ error: "Invalid value for locale field" });
      }

      // Assign a value for targetAmerican 
      // Now that locale must be either "british-to-american" or "american-to-british",
      // the variable targetAmerican will definitely have a value of true or false 
      if (locale === "british-to-american") targetAmerican = true;
      if (locale === "american-to-british") targetAmerican = false;
      //console.log("Is target dialect American? ", targetAmerican);

      const isAmerican = translator.checkAmerican(translator.parseOutWords(text, true));
      const isBritish = translator.checkBritish(translator.parseOutWords(text, true));

      //console.log("Is the current text American? ", isAmerican);
      //console.log("Is the current text British? ", isBritish);

      // Guard statements for if all words are valid in the dialect
      if (text.match(/^\s$/) || (!isAmerican && !isBritish) || (targetAmerican && isAmerican) || (!targetAmerican && isBritish)) {
        return res.json({ text: text, translation: "Everything looks good to me!" });
      }

      //console.log(translator.translate(text, targetAmerican));

      return res.json({
        translation: translator.highlight(translator.translate(text, targetAmerican), targetAmerican),
        text: text
      });

    });
};
