const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');

let translator = new Translator();

suite('Unit Tests', () => {

    // #1: Translate Mangoes are my favorite fruit. to British English
    test('#1 Translate "Mangoes are my favorite food." to British English', function() {
        assert.equal(translator.translate("Mangoes are my favorite food."), "Mangoes are my favourite food.");
    });

    // #2: Translate I ate yogurt for breakfast. to British English
    test('#2 Translate "I ate yogurt for breakfast." to British English', function() {
        assert.equal(translator.translate("I ate yogurt for breakfast."), "I ate yoghurt for breakfast.");
    });

    // #3: Translate We had a party at my friend's condo. to British English
    test('#3 Translate "We had a party at my friend\'s condo." to British English', function() {
        assert.equal(translator.translate("We had a party at my friend\'s condo."), "We had a party at my friend\'s flat.");
    });

    // #4: Translate Can you toss this in the trashcan for me? to British English
    test('#4 Translate "Can you toss this in the trashcan for me?" to British English', function() {
        assert.equal(translator.translate("Can you toss this in the trashcan for me?"), "Can you toss this in the bin for me?");
    });

    // #5: Translate The parking lot was full. to British English
    test('#5 Translate "The parking lot was full." to British English', function() {
        assert.equal(translator.translate("The parking lot was full."), "The car park was full.");
    });

    // #6: Translate Like a high tech Rube Goldberg machine. to British English
    test('#6 Translate "Like a high tech Rube Goldberg machine." to British English', function() {
        assert.equal(translator.translate("Like a high tech Rube Goldberg machine."), "Like a high tech Heath Robinson device.");
    });

    // #7: Translate To play hooky means to skip class or work. to British English
    test('#7 Translate "To play hooky means to skip class or work." to British English', function() {
        assert.equal(translator.translate("To play hooky means to skip class or work."), "To bunk off means to skip class or work.");
    });

    // #8: Translate No Mr. Bond, I expect you to die. to British English
    test('#8 Translate "No Mr. Bond, I expect you to die." to British English', function() {
        assert.equal(translator.translate("No Mr. Bond, I expect you to die."), "No Mr Bond, I expect you to die.");
    });

    // #9: Translate Dr. Grosh will see you now. to British English
    test('#9 Translate "Dr. Grosh will see you now." to British English', function() {
        assert.equal(translator.translate("Dr. Grosh will see you now."), "Dr Grosh will see you now.");
    });

    // #10: Translate Lunch is at 12:15 today. to British English
    test('#10 Translate "Lunch is at 12:15 today." to British English', function() {
        assert.equal(translator.translate("Lunch is at 12:15 today."), "Lunch is at 12.15 today.");
    });

    // #11: Translate We watched the footie match for a while. to American English
    test('#11 Translate "We watched the footie match for a while." to British English', function() {
        assert.equal(translator.translate("We watched the footie match for a while."), "We watched the soccer match for a while.");
    });

    // #12: Translate Paracetamol takes up to an hour to work. to American English
    test('#12 Translate "Paracetamol takes up to an hour to work." to British English', function() {
        assert.equal(translator.translate("Paracetamol takes up to an hour to work."), "Tylenol takes up to an hour to work.");
    });

    // #13: Translate First, caramelise the onions. to American English
    test('#13 Translate "First, caramelise the onions." to British English', function() {
        assert.equal(translator.translate("First, caramelise the onions."), "First, caramelize the onions.");
    });

    // #14: Translate I spent the bank holiday at the funfair. to American English
    test('#14 Translate "I spent the bank holiday at the funfair." to British English', function() {
        assert.equal(translator.translate("I spent the bank holiday at the funfair."), "I spent the public holiday at the carnival.");
    });

    // #15: Translate I had a bicky then went to the chippy. to American English
    test('#15 Translate "I had a bicky then went to the chippy." to British English', function() {
        assert.equal(translator.translate("I had a bicky then went to the chippy."), "I had a cookie then went to the fish-and-chip shop.");
    });

    // #16: Translate I've just got bits and bobs in my bum bag. to American English
    test('#16 Translate "I\'ve just got bits and bobs in my bum bag." to British English', function() {
        assert.equal(translator.translate("I've just got bits and bobs in my bum bag."), "I've just got odds and ends in my fanny pack.");
    });

    // #17: Translate The car boot sale at Boxted Airfield was called off. to American English
    test('#17 Translate "The car boot sale at Boxted Airfield was called off.', function() {
        assert.equal(translator.translate("The car boot sale at Boxted Airfield was called off."), "The swap meet at Boxted Airfield was called off.");
    });

    // #18: Translate Have you met Mrs Kalyani? to American English
    test('#18 Translate "Have you met Mrs Kalyani?', function() {
        assert.equal(translator.translate("Have you met Mrs Kalyani?"), "Have you met Mrs. Kalyani?");
    });

    // #19: Translate Prof Joyner of King's College, London. to American English
    test('#19 Translate "Prof Joyner of King\'s College, London.', function() {
        assert.equal(translator.translate("Prof Joyner of King's College, London."), "Prof. Joyner of King's College, London.");
    });

    // #20: Translate Tea time is usually around 4 or 4.30. to American English
    test('#20 Translate "Tea time is usually around 4 or 4.30.', function() {
        assert.equal(translator.translate("Tea time is usually around 4 or 4.30."), "Tea time is usually around 4 or 4:30.");
    });

    // #21: Highlight translation in Mangoes are my favorite fruit.
    test('#21 Highlight translation in "Mangoes are my favorite fruit."', function() {
        assert.equal(translator.highlight("Mangoes are my favorite fruit."), "Mangoes are my <span class=\"highlight\">favorite</span> fruit.");  
    });

    // #22: Highlight translation in I ate yogurt for breakfast.
    test('#22 Highlight translation in "I ate yogurt for breakfast."', function() {
        assert.equal(translator.highlight("I ate yogurt for breakfast."), "I ate <span class=\"highlight\">yogurt</span> for breakfast.");
    });

    // #23: Highlight translation in We watched the footie match for a while.
    test('#23 Highlight translation in "We watched the footie match for a while."', function() {
        assert.equal(translator.highlight("We watched the footie match for a while."), "We watched the <span class=\"highlight\">footie</span> match for a while.");  
    });

    // #24: Highlight translation in Paracetamol takes up to an hour to work.
    test('#24 Highlight translation in "Paracetamol takes up to an hour to work."', function() {
        assert.equal(translator.highlight("Paracetamol takes up to an hour to work."), "<span class=\"highlight\">Paracetamol</span> takes up to an hour to work.");    
    });

});
