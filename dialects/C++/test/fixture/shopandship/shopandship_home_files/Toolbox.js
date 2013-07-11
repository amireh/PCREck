var _txtRatesWeight;
var _dvRateResults;
var _ddlRatesDestinations;
var _ddlRatesUnit;

var _txtConversionAmount;
var _txtAmountExchanged;
var _ddlFromCurrency;
var _ddlToCurrency;

var _dvOfficeResults;

var _txtTrackShipment;
var _dvTrackingResults;

var _imgProcessingTrack;
var _imgProcessingConverter;
var _imgProcessingOffices;
var _imgProcessingRatesCalc;


function SetClientIDs(txtRatesWeight, dvRateResults, ddlRatesDestinations, ddlRatesUnit,
                      txtConversionAmount, txtAmountExchanged, ddlFromCurrency, ddlToCurrency,
                      dvOfficeResults,
                      txtTrackShipment, dvTrackingResults) {

   

    _txtRatesWeight = txtRatesWeight;
    _dvRateResults = dvRateResults;
    _ddlRatesDestinations = ddlRatesDestinations;
    _ddlRatesUnit = ddlRatesUnit;

    _txtConversionAmount = txtConversionAmount;
     _txtAmountExchanged = txtAmountExchanged;
     _ddlFromCurrency = ddlFromCurrency;
     _ddlToCurrency = ddlToCurrency;

     _dvOfficeResults = dvOfficeResults;

     _txtTrackShipment = txtTrackShipment;
     _dvTrackingResults = dvTrackingResults;


}

function CalculateRates() {
   
    var Weight = document.getElementById(_txtRatesWeight).value;
    var dvRateResults = document.getElementById(_dvRateResults);
    var Destination = document.getElementById(_ddlRatesDestinations).value;
    var validInput = true;

    _imgProcessingRatesCalc = $("#imgRatesCalc");
    _imgProcessingRatesCalc.css('display', 'inline');

    if (Destination == '') {
        dvRateResults.innerHTML = 'Choose a country.';
        validInput = false;
    }

    if (Weight == '') {
        dvRateResults.innerHTML = 'Enter value.';
        validInput = false;
    }

    if (!IsNumeric(Weight)) {
        dvRateResults.innerHTML = 'Enter Numeric Value.';
        validInput = false;
    }

    if (Weight <= 0) {
        dvRateResults.innerHTML = 'Weight must be above 0';
        validInput = false;
    }

    if (!validInput) {
        _imgProcessingRatesCalc.css('display', 'none');
        return;
    }

    $.get("/UserControls/ToolboxHandler.aspx"
        , { ServiceType: 'Rates',
            Param1: document.getElementById(_ddlRatesDestinations).value,
            Param2: Weight,
            Param3: document.getElementById(_ddlRatesUnit).value
        }
        , function (data) // On successfully retrival of response 
        {
            dvRateResults.innerHTML = data;
            _imgProcessingRatesCalc.css('display', 'none');
        });

}


function ConvertCurrencies() {


    var Amount = document.getElementById(_txtConversionAmount).value;
    var validInput = true;
    _imgProcessingConverter = $("#imgConverter");
    _imgProcessingConverter.css('display', 'inline');

    if (Amount == '') {
        document.getElementById(_txtAmountExchanged).innerHTML = 'Enter Value.';
        validInput = false;
    }

    if (!IsNumeric(Amount)) {
        document.getElementById(_txtAmountExchanged).innerHTML = 'Enter Numeric Value.';
        validInput = false;
    }

    if (!validInput) {
        _imgProcessingConverter.css('display', 'none');
        return;
    }

    $.get("/UserControls/ToolboxHandler.aspx"
        , { ServiceType: 'currency',
            Param1: document.getElementById(_ddlFromCurrency).value,
            Param2: document.getElementById(_ddlToCurrency).value,
            Param3: Amount
        }
        , function (data) // On successfully retrival of response 
        {
            document.getElementById(_txtAmountExchanged).innerHTML = data;
            _imgProcessingConverter.css('display', 'none');
        });

}

function CountryChanged(selectedCountry) {
    
    // debugger;

    var ddlCountries = $("[id$='ddlCountries']");
    var ddlCountriesLeft = $("[id$='ddlCountriesLeft']");
    _imgProcessingOffices = $("#imgOffices");

    if (ddlCountries != null) { ddlCountries.css('width', '184px');  }
    if (ddlCountriesLeft != null) { ddlCountriesLeft.css('width', '134px'); }
   
    _imgProcessingOffices.css('display', 'inline');

    if (selectedCountry != '') {


        $.get("/UserControls/ToolboxHandler.aspx"
        , { ServiceType: 'office',
            Param1: selectedCountry,
            Param2: '',
            Param3: ''
        }
        , function (data) // On successfully retrival of response 
        {
            document.getElementById(_dvOfficeResults).innerHTML = data;
            _imgProcessingOffices.css('display', 'none');
            if (ddlCountries != null) { ddlCountries.css('width', '200px'); }
            if (ddlCountriesLeft != null) { ddlCountriesLeft.css('width', '150px'); }


        });
       

    }
}


function TrackShipments(source) {

    var _LoadingImage = $('#imgProcessingTracking');
    _LoadingImage.css('display', 'inline');

    $.get("/UserControls/ToolboxHandler.aspx"
        , { ServiceType: 'track',
            Param1: document.getElementById(_txtTrackShipment).value,
            Param2: '3',
            Param3: source
           
        }
        , function (data) // On successfully retrival of response 
        {
            document.getElementById(_dvTrackingResults).innerHTML = data;
            _LoadingImage.css('display', 'none');

        });

}


$(document).ready(function () {

    $('textarea[maxlength]').keyup(function () {
        //get the limit from maxlength attribute
        var limit = parseInt($(this).attr('maxlength'));
        //get the current text inside the textarea
        var text = $(this).val();
        //count the number of characters in the text
        var chars = text.length;

        //check if there are more characters then allowed
        if (chars > limit) {
            //and if there are use substr to get the text before the limit
            var new_text = text.substr(0, limit);

            //and change the current text with the new text
            $(this).val(new_text);
        }
    });

});


function IsNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}