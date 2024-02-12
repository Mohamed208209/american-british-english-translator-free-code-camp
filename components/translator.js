const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

// Swap the keys and values of two of the dictionaries
// Source: https://bobbyhadz.com/blog/javascript-swap-object-key-and-value

const swapKeysWithValues = ([key, value]) =>  [value, key];

const fullSwap = (dict) => Object.fromEntries(Object.entries(dict).map(swapKeysWithValues));

const britishToAmericanSpelling = fullSwap(americanToBritishSpelling);
const britishToAmericanTitles = fullSwap(americanToBritishTitles);

const timesRegExBritish = new RegExp("(?<=\\d)[.](?=\\d{2})");
const timesRegExAmerican = new RegExp("(?<=\\d)[:](?=\\d{2})");
const titlesRegExAmer = new RegExp("mr.|ms.|mrs.|dr.|mx.|prof.", "gi");
const titlesRegExBrit = new RegExp("mr|ms|mrs|dr|mx|prof", "gi");

class Translator {

    wordIsAmerican(word) {
        return americanOnly.hasOwnProperty(word.toLowerCase()) || americanToBritishSpelling.hasOwnProperty(word.toLowerCase()) || americanToBritishTitles.hasOwnProperty(word.toLowerCase()) || word.match(timesRegExAmerican);
    }

    wordIsBritish(word) {
        return britishOnly.hasOwnProperty(word.toLowerCase()) || Object.values(americanToBritishSpelling).includes(word.toLowerCase()) || Object.values(americanToBritishTitles).includes(word.toLowerCase()) || word.match(timesRegExBritish);
    }

    checkAmerican(words) {
        return words.some(this.wordIsAmerican);
    }

    checkBritish(words) {
        return words.some(this.wordIsBritish);
    }

    parseOutWords(sentence, dict) {

        // Break down sentence into array of words
        const arraySpaces = sentence.split(/[ ]/);

        const periodsRegEx = new RegExp('((?<!mr|ms|mrs|dr|mx|prof|\\d{1,2})[.])|[;]|[,]|[?]', 'gi');

        const arrayCommas = arraySpaces.reduce((prev, current) => {
            if (current.match(periodsRegEx)) return prev.concat(current.substring(0, current.length - 1)).concat(current.substring(current.length - 1));
            else return prev.concat(current);
        }, []);

        const arrayPaired = arrayCommas.reduce((prev, current, index, array) => {
            //console.log(prev, current, index, `${prev[prev.length - 1]} ${current}`);
            const reg = new RegExp(`^${prev[prev.length - 1]} ${current}`, 'i');
            //console.log("prev: ", prev);
            //console.log(reg);
            //if (index === 0) console.log(Object.keys(dict));
            //console.log(Object.keys(dict).some(val => val.match(reg)));
            if (Object.keys(dict).some(val => val.match(reg))) {
                //console.log("reached");
                return prev.slice(0, prev.length - 1).concat(prev[prev.length - 1] + " " + current);
            }
            else return prev.concat(current);
        }, []);

        //console.log(arrayPaired);
        return arrayPaired; 
    }

    replaceWords(array, dict) {
        return array.reduce((prev, current) => {
            //console.log(current, dict.hasOwnProperty(current.toLowerCase()));
            if (dict.hasOwnProperty(current.toLowerCase())) return prev.concat(dict[current.toLowerCase()]);  
            else return prev.concat(current);   
        }, []);
    }

    capitalizeTitle(string) {
        let title, newString;
        
        if (string.match(titlesRegExAmer)) {
            title = string.match(titlesRegExAmer)[0];
            title = title.substring(0, 1).toUpperCase() + title.substring(1);
            newString = string.replace(titlesRegExAmer, title);
        } else {
            newString = string;
        }

        return newString;
    }

    adjustTimes(string, isAmerican) {
        let newString;
        //console.log("adjust: ", string); 

        if (isAmerican) newString = string.replace(timesRegExAmerican, ".");
        else newString = string.replace(timesRegExBritish, ":");

        //console.log(newString);

        return newString;
    }

    joinArray(array) {
        return array.reduce((prev, current, index) => current.match(/^[.]|[;]|[,]|[?]/) || index === 0 ? prev.concat("", current) : prev.concat(" ", current), "");
    }

    // The translate() function takes an optional second parameter
    translate(sentence, localeIsAmerican = null) {

        let isAmerican, isBritish;

        // Parse the array for punctuation and word groupings (based on the dictionary used)
        let arrayParsedAmer = this.parseOutWords(sentence, americanOnly);
        let arrayParsedBrit = this.parseOutWords(sentence, britishOnly);
        //console.log("parsed american: ", arrayParsedAmer)
        //console.log("parsed brit: ", arrayParsedBrit);

        // Choose the shorter array; if they are the same size, it doesn't matter which is chosen
        let arrayOfWords = arrayParsedAmer.length > arrayParsedBrit.length ? arrayParsedBrit : arrayParsedAmer;
        //console.log("array chosen: ", arrayOfWords);

        // Check to see if the sentence is written in American or British English
        // if localeIsAmerican is not provided 
        isAmerican = localeIsAmerican === true ? true : this.checkAmerican(arrayOfWords);
        isBritish = localeIsAmerican === false ? false : this.checkBritish(arrayOfWords);
        //console.log("Is American? ", isAmerican);
        //console.log("Is British? ", isBritish);

        // Translate the words in the array
        let arrayWithReplacements = [];

        if (isAmerican) {
            arrayWithReplacements = this.replaceWords(arrayOfWords, americanOnly);
            //console.log(arrayWithReplacements);
            arrayWithReplacements = this.replaceWords(arrayWithReplacements, americanToBritishSpelling);
            arrayWithReplacements = this.replaceWords(arrayWithReplacements, americanToBritishTitles);
        }

        if (isBritish) {
            arrayWithReplacements = this.replaceWords(arrayOfWords, britishOnly);
            arrayWithReplacements = this.replaceWords(arrayWithReplacements, britishToAmericanSpelling);
            arrayWithReplacements = this.replaceWords(arrayWithReplacements, britishToAmericanTitles);
        }

        
        //console.log("array after replacements: ", arrayWithReplacements);
        // Link the words in the array back together
        let finalString = this.joinArray(arrayWithReplacements);
        //console.log(finalString);

        // Capitalize titles if there are any
        finalString = this.capitalizeTitle(finalString);
        //console.log("final: ", finalString);

        // Adjust the times if there are any
        if (isAmerican) finalString = this.adjustTimes(finalString, true);
        if (isBritish) finalString = this.adjustTimes(finalString, false);

        return finalString;

    }

     
    highlight(sentence, isAmerican = null) {
        const arrayParsedBrit = this.parseOutWords(sentence, americanOnly);
        const arrayParsedAmer = this.parseOutWords(sentence, britishOnly);
        
        const arrayParsed = arrayParsedAmer.length > arrayParsedBrit.length ? arrayParsedBrit : arrayParsedAmer;
        //console.log(arrayParsed);

        if (!isAmerican) {
            isAmerican = this.checkAmerican(arrayParsed);
        }

        let finalArray = [];

        if (isAmerican) {
            finalArray = arrayParsed.reduce((prev, current) => {
                if (this.wordIsAmerican(current) || current.match(timesRegExAmerican) || current.match(titlesRegExAmer)) {
                    return prev.concat(`<span class="highlight">${current}</span>`)
                } else {
                    return prev.concat(current);
                }
            }, [])
        } else {
            finalArray = arrayParsed.reduce((prev, current) => {
                if (this.wordIsBritish(current) || current.match(timesRegExBritish) || current.match(titlesRegExBrit)) {
                    return prev.concat(`<span class="highlight">${current}</span>`)
                } else {
                    return prev.concat(current);
                }
            }, [])
        }

        return this.joinArray(finalArray);
    }

}

module.exports = Translator;