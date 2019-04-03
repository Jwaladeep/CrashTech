
$(document).ready(function() {
    
   /* $('input').on('blur', function() {
        if ($("#registrationform").valid()) {
            $('#registerbtn').prop('disabled', false);  
        } else {
            $('#registerbtn').prop('disabled', 'disabled');
        }
    });
    
    $("#registrationform").validate({
        rules: {
            name: {
                required: true,
                minlength: 4
            },
            email: {
                required: true,
                email: true
            }
		
        }
    });
	*/
	$('#resetbtn').on('click', function(event){
	$('#registrationform').trigger("reset");	
	});
	
	$("#registrationform").on('keyup change','input',function(event){
		validateForm('#registrationform');
	});
	
	$('#4D').on('click',function (){navToFourth("4-Day CrashTech")});
	$('#FD').on('click',function (){navToFourth("Frontend Development")});
	$('#MS').on('click',function (){navToFourth("Middleware Services")});
	$('#MEAN').on('click',function (){navToFourth("MEAN Stack Development")});
	$('#BD').on('click',function (){navToFourth("Backend Development")});
	$('#TIW').on('click',function (){navToFourth("Technical Interview Workshop")});
	$('#DSA').on('click',function (){navToFourth("Data Structure & Algorithms")});
	$('#signupbtn').on('click',function (){navToFourth("")});
	
});

function navToFourth(msg){
		$('.dot').trigger('click');
		$('#registerfor').val(msg);
}
	
	function validateForm(id){
		var name = document.getElementById("name").value;
	var orgname = document.getElementById("orgname").value;
	var email = document.getElementById("email").value;
	var phone = document.getElementById("phone").value;
	var city = document.getElementById("city").value;
	var appdate = document.getElementById("appdate").value;
	var registerfor = document.getElementById("registerfor").value;
	if(name&& orgname && email&& phone && city && registerfor && appdate){
		$('#registerbtn').prop('disabled', false); 
	}
	else{
		$('#registerbtn').prop('disabled', 'disabled');
	}

}

function onClickRegister(oEvent){
	var name = document.getElementById("name").value;
	var orgname = document.getElementById("orgname").value;
	var email = document.getElementById("email").value;
	var phone = document.getElementById("phone").value;
	var city = document.getElementById("city").value;
	var appdate = document.getElementById("appdate").value;
	var registerfor = document.getElementById("registerfor").value;
	var toSend={
		"name": name,
		"orgname": orgname,
		"email":email,
		"phone":phone,
		"city":city,
		"appdate":appdate,
		"registerfor":registerfor
		
	};
	alert(JSON.stringify(toSend));
	
	var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://crashtech-undeputized-peacockism.cfapps.eu10.hana.ondemand.com/register/",
  "method": "POST",
  "headers": {
    "content-type": "application/x-www-form-urlencoded",
    "cache-control": "no-cache",
  },
  "data": toSend
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
	alert('this is it from script0');
}

function moveToFourthPage(oEvent){
	$("#fourthdot").trigger('click');
	$("#registerfor").value=oEvent;
	
}