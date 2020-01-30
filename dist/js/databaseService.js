//the name of the hosting server
var servername = "https://localhost:5001";// "https://savemydata.sariahouloubi.com"//"https://calm-meadow-22429.herokuapp.com";
//The security token for adding values to the database
var jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZDljN2Y0NC0xYzU2LTQ4OWUtYWQ5Zi1hNDMzZjQ5MTVkYjkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJteWNvb2xNYWlsQGV4YW1wbGUuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IkZvbyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcHJpbWFyeXNpZCI6IjJlODdiNDMxLTE3MTctNGYxMi04ODJlLTc1ZmFkYjg4NGY5ZSIsImV4cCI6MTU4NTQ2NDgwOSwiaXNzIjoic2F2ZW15ZGF0YS5zYXJpYWhvdWxvdWJpLmNvbSIsImF1ZCI6InNhdmVteWRhdGEuc2FyaWFob3Vsb3ViaS5jb20ifQ.eazsSQ5qx07n8SiPxhNuKDSicmEY1p8z7fa11qZVPiQ";//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNmZkMDEwNC1hZjUzLTQ5YmItOTU3Yy04MjVkZDdiOTBlODMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzYXJhaC5zaGFoaWQ2QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJTYXJhaCBTaGFoaWQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3ByaW1hcnlzaWQiOiI4MDBiMGI4ZS05MjVkLTQ5MDctOTc3MC0zNmIyZjU3MGI2MWQiLCJleHAiOjE1ODU0MjU2NjcsImlzcyI6InNhdmVteWRhdGEuc2FyaWFob3Vsb3ViaS5jb20iLCJhdWQiOiJzYXZlbXlkYXRhLnNhcmlhaG91bG91YmkuY29tIn0.bZg51gOrJUyi5hgszx7rgeFSqZGkOO76RTh7qr0PQnA";
//The name of the databse to save the data in
var databaseName = "BE";
//The table that holds the registerd  users data
var userTableName = "Users";
//The table that holds each step of the user in the survey
var surveyDetails = "SurveyDetails";
//The table that holds the final results
var surveyResults = "SurveyResults";
//The id of the user that will be filled once the first registerd
var savedUserId = "";

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
function saveStepData(){
    $.ajax({
        url: `${servername}/api/recordapi/create`,
        method : "POST",
        headers: { "Authorization": 'Bearer ' + jwtToken, "Content-Type" : 'application/json' },
        data : JSON.stringify({
            Database: databaseName,
            Table : surveyDetails,
            Data : {
                user_Id : savedUserId,
                Current_Step : currentStep,
                Current_Step_Type : currentStepType,
                User_Available : useravailable,
                Contract_life_Period : ( 5 - currentcontractvalidation ) + 1,
                Contract_Details : {
                    Experience : currentcontractExp_C,
                    Qualification : currentcontractQ_C,
                    Salary : currentcontractSalary,
                    Number_of_hours : currentcontractNOH,
                    Additionals : currentcontractAdditional
                },
                User_Details:{
                    Experience : Exp_I,
                    Qualification : Q_I,
                },
                Time : new Date().toLocaleTimeString(),
            }
        }),
        error: function(error){
            alert('Something wrong happend, kindly stop and contact the adminstration');
            console.log(error);
        }
    })
}

//A falg to make sure the data is only sent one time
var dataSaved = false
//
// Sends the data back to the excel api 
//
function saveResultData(){
    
    $("#signbtn").prop('disabled', true);
    $("#stepForwardButton").prop('disabled',true);
    if(!dataSaved){      
        $.ajax({
            url : `${servername}/api/recordapi/create`,
            headers: { "Authorization": 'Bearer ' + jwtToken, "Content-Type" : 'application/json' },
            type : "POST",
            data : JSON.stringify({
                        Database :"BE"
                        ,Table: surveyResults
                        ,data : {user_Id: savedUserId,
                             totalIncome,
                             contractsSigned,
                             contractsCanceled,
                             contractsSignedAfterCancel,
                             countSkipInOC,
                             countSkipInRP}
                    }),
            success : function(result){
                alert("لقد انتهت هذه التجربة بنجاح! شكراً لوقتك");
                //mark the data as saved to make sure it will not be sent again in the same session
                dataSaved = true;
                if(useravailable){
                    canclecontract()
                }
            },
            error : function(error){
                $("#stepForwardButton").prop('disabled',false);
                alert("Data was not saved!")
                console.log(error)
            }
        })
    }
}