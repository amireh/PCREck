/* 
* To change this template, choose Tools | Templates
* and open the template in the editor.
*/

$(document).ready(function () {
    $('#newsletter-subscribe').submit(function() {
        var email = $("input#edit-subscribe-email").val();
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        if((email == 0) || (reg.test(email) == false)){
            alert("Please enter a valid Email Address...");
            return false;
        }
        else 
            return true;
    });
});
