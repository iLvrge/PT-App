export const numberWithCommas = (x) => {
    return x != undefined ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
}

export const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.toLowerCase().charAt(0).toUpperCase() + s.toLowerCase().slice(1)
}

export const addCommas = (nStr) => {
    nStr += ''
    var x = nStr.split('.')
    var x1 = x[0]
    var x2 = x.length > 1 ? '.' + x[1] : ''
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2')
    }
    return x1 + x2
}
 
export const applicationFormat = (x) => {
    return x != undefined ? x.toString().substr(0,2) +'/'+ x.toString().substr(2, x.toString().length - 1).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
}

export const capitalizeEachWord = (sentence) => {
    /*return sentence != undefined ? sentence.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) : ''*/
    /*return sentence != undefined ? sentence.toLowerCase().replace( /\b.([^of])/g, function(a){ return a.toUpperCase()}) : ''*/
    return sentence != undefined ? sentence.toLowerCase().replace( /\b.([^of])/g, function(a){ return a.toUpperCase()}).charAt(0) + sentence.charAt(1).toLocaleLowerCase() + sentence.slice(2) : '';
}

export const toTitleCase =  (str) => {
    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i
    var alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/
    var wordSeparators = /([ :–—-])/
    if(str === null) return ''
    return str.toLowerCase().split(wordSeparators)
      .map(function (current, index, array) {
        if (
          /* Check for small words */  
          current.search(smallWords) > -1 &&
          /* Skip first and last word */
          index !== 0 &&
          index !== array.length - 1 &&
          /* Ignore title end and subtitle start */
          array[index - 3] !== ':' &&
          array[index + 1] !== ':' &&
          /* Ignore small words that start a hyphenated phrase */
          (array[index + 1] !== '-' ||
            (array[index - 1] === '-' && array[index + 1] === '-'))
        ) {
          return current.toLowerCase()
        }
  
        /* Ignore intentional capitalization */
        if (current.substr(1).search(/[A-Z]|\../) > -1) {
          return current
        }
  
        /* Ignore URLs */
        if (array[index + 1] === ':' && array[index + 2] !== '') {
          return current
        }
  
        /* Capitalize the first letter */
        return current.replace(alphanumericPattern, function (match) {
          return match.toUpperCase()
        })
      })
      .join('');
}

export const ptabHeadings = {
    'accordedFilingDate': 'Accorded Filing Date',
    'applicationNumberText': 'Application Number',
	'inventorName': 'Inventor Name',
	'partyName': 'Party Name',
	'patentNumber': 'Patent Number',
    'appellantApplicationNumberText': 'Appellant Application Number Text',
    'appellantCounselName': 'Appellant Counsel Name',
    'appellantGrantDate': 'Appellant Grant Date',
    'appellantGroupArtUnitNumber': 'Appellant Group Art Unit Number',
    'appellantInventorName':            'Appellant Inventor Name',
    'appellantPartyName':               'Appellant Party Name',
    'appellantPatentNumber':            'Appellant Patent Number',
    'appellantPatentOwnerName':         'Appellant Patent Owner Name',
    'appellantPublicationDate':         'Appellant Publication Date',
    'appellantPublicationNumber':       'Appellant Publication Number',
    'appellantTechnologyCenterNumber':  'Appellant Technology Center Number',
    'decisionDate':                     'Decision Date',
    'declarationDate':                  'Declaration Date',
    'docketNoticeMailDate':             'Docket Notice Mail Date',
    'documents':                        'Documents',
    'institutionDecisionDate':          'Institution Decision Date',
    'lastModifiedDate':                 'Last Modified Date',
    'lastModifiedUserId':               'Last Modified UserId',
    'petitionerApplicationNumberText':  'Petitioner Application Number Text',
    'petitionerCounselName':            'Petitioner Counsel Name',
    'petitionerGrantDate':              'Petitioner Grant Date',
    'petitionerGroupArtUnitNumber':     'Petitioner Group Art Unit Number',
    'petitionerInventorName':           'Petitioner Inventor Name',
    'petitionerPartyName':              'Petitioner Party Name',
    'petitionerPatentNumber':           'Petitioner Patent Number',
    'petitionerPatentOwnerName':        'Petitioner Patent Owner Name',
    'petitionerTechnologyCenterNumber': 'Petitioner Technology Center Number',
    'proceedingFilingDate': 'Proceeding Filing Date',
    'proceedingLastModifiedDate': 'Proceeding Last Modified Date',
    'proceedingNumber': 'Proceeding Number',
    'proceedingStatusCategory': 'Proceeding Status Category',
    'proceedingTypeCategory': 'Proceeding Type Category',
    'respondentApplicationNumberText': 'Respondent Application Number Text',
    'respondentCounselName': 'Respondent Counsel Name',
    'respondentGrantDate': 'Respondent Grant Date',
    'respondentGroupArtUnitNumber': 'Respondent Group Art Unit Number',
    'respondentInventorName': 'Respondent Inventor Name',
    'respondentPartyName': 'Respondent Party Name',
    'respondentPatentNumber': 'Respondent Patent Number',
    'respondentPatentOwnerName': 'Respondent Patent Owner Name',
    'respondentPublicationDate': 'Respondent Publication Date',
    'respondentPublicationNumber': 'Respondent Publication Number',
    'respondentTechnologyCenterNumber': 'Respondent Technology Center Number',
    'secondRespondentApplNumberText': 'SecondRespondent Appl Number Text',
    'secondRespondentCounselName': 'Second Respondent Counsel Name',
    'secondRespondentGAUNumber': 'Second Respondent GAU Number',
    'secondRespondentGrantDate': 'Second Respondent Grant Date',
    'secondRespondentInventorName': 'Second Respondent Inventor Name',
    'secondRespondentPartyName': 'Second Respondent Party Name',
    'secondRespondentPatentNumber': 'Second Respondent Patent Number',
    'secondRespondentPatentOwnerName': 'Second Respondent Patent OwnerName',
    'secondRespondentPubNumber': 'Second Respondent PubNumber',
    'secondRespondentPublicationDate': 'Second Respondent Publication Date',
    'secondRespondentTechCenterNumber': 'Second Respondent TechCenter Number',
    'styleNameText': 'Style Name Text',
    'subproceedingTypeCategory': 'Subproceeding Type Category',
    'thirdPartyName': 'Third Party Name'
}