module("Aural.Utils.MML");

test('parse single voice', function() {
	var mml = 't150v5l4o6 cdr>e';

	var mmlFile = new Aural.Utils.MML.File(mml);

	equal(mmlFile.getVoiceCount(), 1);

	var phrase1 = mmlFile.getPhrase(0);
	var phrase2 = mmlFile.getPhrase(1);
	var phraseAll = mmlFile.getPhrase();

	equal(phrase1.noteEvents.length, 3);
	equal(phrase2, null);
	equal(phraseAll.noteEvents.length, 3);
});

test('parse multiple voices', function() {
	var mml = 't132\r\n v5 l4 a r a b+;\r\n v16 l2 e e;';

	var mmlFile = new Aural.Utils.MML.File(mml);

	//console.log(mmlFile);

	equal(mmlFile.getVoiceCount(), 2);

	var phrase1 = mmlFile.getPhrase(0);
	var phrase2 = mmlFile.getPhrase(1);
	var phrase3 = mmlFile.getPhrase(2);
	var phraseAll = mmlFile.getPhrase();

	equal(phrase1.noteEvents.length, 3);
	equal(phrase2.noteEvents.length, 2);
	equal(phrase3, null);
	equal(phraseAll.noteEvents.length, 5);
});