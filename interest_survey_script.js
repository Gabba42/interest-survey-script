function formatAndSendSurveyData() {

    //get the sheet by ID 
    var spreadsheet = SpreadsheetApp.getActiveSheet();
  
    //1. Filter out any blanks left by Integromat workflow
  
    //build original data 
    var lastRow = spreadsheet.getLastRow(); 
    var lastColumn = spreadsheet.getLastColumn(); 
    var originalData =  spreadsheet.getRange(2, 1, lastRow-1, lastColumn).getValues();
  
    Logger.log("original data: " + originalData); 
  
    //filter out blanks
    var blankIndexes = []; 
    originalData.filter(function(item, index) { 
      
      if(item[1] == "") {
        blankIndexes.push(index + 2);  
      } 
    
    });
  
    Logger.log("blank indexes: " + blankIndexes);
  
    //delete blank rows
    var removeBlanks = function() {
      for (var i = blankIndexes.length-1; i >= 0; i--) { //important to delete bottom then up!!
        console.log(blankIndexes[i]); 
        spreadsheet.deleteRow(blankIndexes[i]);
      }
    }
  
    removeBlanks(); 
  
    Logger.log("formatted data without blanks: " + originalData); 
  
    //2. Copy and save copy of sheet to an existing folder (in the share drive) 
    
    var snapShotDate = function() {
      var currentMonth = new Date().getMonth();
      var currentYear = new Date().getFullYear(); 
  
      switch(currentMonth) {
        case 0: 
          return "Jan_" + currentYear + " "; 
          break; 
        case 1: 
          return "Feb_" + currentYear + " "; 
          break; 
        case 2: 
          return "Mar_" + currentYear + " "; 
          break; 
        case 3: 
          return "Apr_" + currentYear + " "; 
          break;
        case 4: 
          return "May_" + currentYear + " "; 
          break;
        case 5:
          return "Jun_" + currentYear + " "; 
          break;
        case 6: 
          return "Jul_" + currentYear + " "; 
          break;
        case 7: 
          return "Aug_" + currentYear + " "; 
          break;
        case 8: 
          return "Sept_" + currentYear + " "; 
          break;
        case 9: 
          return "Oct_" + currentYear + " ";
          break;
        case 10: 
          return "Nov_" + currentYear + " ";
          break;
        case 11: 
          return "Dec_" + currentYear + " "; 
          break;
        default: 
          return "error!"; 
          break;
      }
    }
  
    var interestSurveyFile = DriveApp.getFileById("1M8hjzAL6Qn7jrk8mzAFtLbC6qNifEX34arRMXbov9TM"); 
    var surveyReultsFolder = DriveApp.getFolderById("1QHYnzglpVmJ-RM7gwJjWfDBUikldH-RU"); 
    interestSurveyFile.makeCopy(snapShotDate() + "Interest Survey Snapshot",surveyReultsFolder);
  
    //3. Send an email that the sheet has been formatted and copied into the share drive with a link to access it 
    var surveyReultsFolderURL = DriveApp.getFolderById("1QHYnzglpVmJ-RM7gwJjWfDBUikldH-RU").getUrl()
    var subject = "Monthly Member Interest Survey Snapshot Uploaded"; 
    var body = "This email requires HTML support. Please use a client that supports HTML."
    var htmlText = "<h3>(This is an automated script. Please do not reply-to this message!)</h3>" +
    "<p>There is a new monthly snapshot of the Member Interest Survey Form.</p>" + 
    "<p>Follow the link below to be directed to the Survey Reports folder located on the PPM share drive." + 
    "<br>" +
    "<a href="+surveyReultsFolderURL+">Survey Results Folder</a>";
  
    var options = {
      htmlBody: htmlText,
      name: 'Interest Survey Script',
      from: 'contact@pikespeakmakerspace.org'
    }  
  
    GmailApp.sendEmail("gabriela.lisboa@pikespeakmakerspace.org", subject, body, options);
    GmailApp.sendEmail("drew.johnson@pikespeakmakerspace.org", subject, body, options);
  }