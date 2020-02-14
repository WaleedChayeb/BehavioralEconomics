//the name of the hosting server
var servername = "https://savemydata.sariahouloubi.com";
//The security token for adding values to the database
var jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNmZkMDEwNC1hZjUzLTQ5YmItOTU3Yy04MjVkZDdiOTBlODMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzYXJhaC5zaGFoaWQ2QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJTYXJhaCBTaGFoaWQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3ByaW1hcnlzaWQiOiI4MDBiMGI4ZS05MjVkLTQ5MDctOTc3MC0zNmIyZjU3MGI2MWQiLCJleHAiOjE1ODU0MjU2NjcsImlzcyI6InNhdmVteWRhdGEuc2FyaWFob3Vsb3ViaS5jb20iLCJhdWQiOiJzYXZlbXlkYXRhLnNhcmlhaG91bG91YmkuY29tIn0.bZg51gOrJUyi5hgszx7rgeFSqZGkOO76RTh7qr0PQnA";
//The name of the databse to save the data in
var databaseName = "BE-Test3-3";
//The table that holds the registerd  users data
var userTableName = "Users";
//The table that holds each step of the user in the survey
var surveyDetails = "SurveyDetails";
//The table that holds the final results
var surveyGeneralResults = "SurveyGenralResults";
//The table that holds the details that happend in each step type
var surveyStepTypeDetaildResult = "SurveyStepTypeDetaildResult";
//The id of the user that will be filled once the first registerd
var savedUserId = "";
//The data that was not saved
var notSavedData = [];

//
//The function that save the user basic credentials data
//
function saveUserCredentials(){
    $.ajax({
        url  : `${servername}/api/recordapi/create`,
        method: 'POST',
        headers: { "Authorization": 'Bearer ' + jwtToken, "Content-Type" : 'application/json' },
        data : JSON.stringify({
            Database : databaseName,
            Table : userTableName,
            data : {username,DOB,gender},
            }),
        success : function(data){
            //Set the user id
            savedUserId = data[0].value;
        },
        error: function(error){
            alert(`Something wrong happend do not continue refresh page and register again`)
            console.log(error);
        }
    });
}

//
//The function to save the data for each step of the user
//
function saveStepData(data = null){
    var currentData = data || {
            Database: databaseName,
            Table : surveyDetails,
            Data :{
            user_Id : savedUserId,
                    Current_Step : currentStep,
                    Current_Step_Type : currentStepType,
                    User_Available : useravailable,
                    Contract_life_Period : ( 5 - currentcontractvalidation ),
                    Contract_Details : {
                        Experience : currentcontractExp_C,
                        Qualification : currentcontractQ_C,
                        Salary : currentcontractSalary,
                        Number_of_hours : currentcontractNOH,
                        Additionals : currentcontractAF
                    },
                    User_Details:{
                        Experience : Exp_I,
                        Qualification : Q_I,
                    },
                    Time : new Date().toLocaleTimeString(),
        }
    }

    $.ajax({
        url: `${servername}/api/recordapi/create`,
        method : "POST",
        headers: { "Authorization": 'Bearer ' + jwtToken, "Content-Type" : 'application/json' },
        data : JSON.stringify(currentData),
        error: function(error){
            keepNotSaved(currentData);
            console.log(error);
        }
    })
}

//A falg to make sure the data is only sent one time
var dataSaved = false
//
// Saves the general result data  
//
function saveResultData(data = null){
    
    $("#signbtn").prop('disabled', true);
    $("#stepForwardButton").prop('disabled',true);

    var currentData = data || {
         Database :databaseName
        ,Table: surveyGeneralResults
        ,data : {user_Id: savedUserId,
            Total_Income: totalIncome,
            Contract_Signed :{
                OC :{
                    Steps: contractsSigned[stepType.OC].join(' , '),
                    Count: contractsSigned[stepType.OC].length
                },
                RP : {
                    Steps: contractsSigned[stepType.RP].join(' , '),
                    Count: contractsSigned[stepType.RP].length
                },
                N :{
                    Steps: contractsSigned[stepType.N].join(' , '),
                    Count: contractsSigned[stepType.N].length
                },
                Count : GetStepTypesArrayLength(contractsSigned)
            },
            Contract_Canceled:{
                OC :{
                    Steps: contractsCanceled[stepType.OC].join(' , '),
                    Count: contractsCanceled[stepType.OC].length
                },
                RP : {
                    Steps: contractsCanceled[stepType.RP].join(' , '),
                    Count: contractsCanceled[stepType.RP].length
                },
                N :{
                    Steps: contractsCanceled[stepType.N].join(' , '),
                    Count: contractsCanceled[stepType.N].length
                },
                Count : GetStepTypesArrayLength(contractsCanceled)
            },
            Contract_Sing_After_Cancel :{
                OC :{
                    Steps: contractsSignedAfterCancel[stepType.OC].join(' , '),
                    Count: contractsSignedAfterCancel[stepType.OC].length
                },
                RP : {
                    Steps: contractsSignedAfterCancel[stepType.RP].join(' , '),
                    Count: contractsSignedAfterCancel[stepType.RP].length
                },
                N :{
                    Steps: contractsSignedAfterCancel[stepType.N].join(' , '),
                    Count: contractsSignedAfterCancel[stepType.N].length
                },
                Count : GetStepTypesArrayLength(contractsSignedAfterCancel)
            },
            Contract_Skip :{
                OC :{
                    Count: contcontractSkip[stepType.OC]
                },
                RP : {
                    Count: contcontractSkip[stepType.RP]
                },
                N :{
                    Count: contcontractSkip[stepType.N]
                },
                Count :  GetStepTypesCount(contcontractSkip) 
                }
            }
    }
    if(!dataSaved){      
        dataSaved = true;
        $.ajax({
            url : `${servername}/api/recordapi/create`,
            headers: { "Authorization": 'Bearer ' + jwtToken, "Content-Type" : 'application/json' },
            type : "POST",
            data : JSON.stringify(currentData),
            success : function(result){
                alert(` لقد انتهت هذه التجربة بنجاح! شكراً لوقتك.\n لقد تم تحصيل راتب تجميعي وقدره ${totalIncome}`);
                //mark the data as saved to make sure it will not be sent again in the same session
                if(useravailable){
                    canclecontract()
                }  },
            error : function(error){
                $("#stepForwardButton").prop('disabled',false);
                keepNotSaved(currentData);
                console.log(error)
            }
        })

        alert("make sure that your data is saved!");
    }
}

//
//Keep the data that is not saved back in an array
//  data : the data that was not saved
//
function keepNotSaved(data){
    notSavedData.push(data)
    document.getElementById('not-saved-data').textContent = notSavedData.length;
}

//
//Check the data that is not saved and send them to the server
//
function checkAllDataSaved(){
        //Loop throw the unsaved data
        while (notSavedData.length > 0) {
            //Try to save the data  
            saveStepData(notSavedData.shift());
            //Update counter
            document.getElementById('not-saved-data').textContent = notSavedData.length;
        }
}