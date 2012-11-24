(function( $ ) {
  $.fn.failSafeForm = function( options ) {

    // Create some defaults, extending them with any options that were provided
    var settings = $.extend( {
      'validate' : false
    }, options);

    return this.each(function(index, possibleFormElement) {

      var formId = $(possibleFormElement).attr("id");

      var loadStandardInput = function( input ){
        var inputId = $(input).attr("id");
        var value = localStorage.getItem(formId + "." + inputId);
        $(input).attr("value", value);
      };

      var loadCheckBox = function( checkBoxItem ){
        var checkBoxId = $(checkBoxItem).attr("id");
        var isChecked = localStorage.getItem(formId + "." + checkBoxId);
        if(isChecked == "true"){
          $(checkBoxItem).attr("checked","checked");
        } else {
          $(checkBoxItem).removeAttr("checked");
        }
      };

      var loadRadio = function( radioPart ){
        var radioSetName = $(radioPart).attr("name");
        var radioPartId = localStorage.getItem(formId + "." + radioSetName);
        $("#" + radioPartId).attr("checked","checked");
      };

      var loadTextArea = function( textArea ){
        var textAreaId = $(textArea).attr("id");
        var textAreaValue = localStorage.getItem(formId + "." + textAreaId);
        $(textArea).attr("value", textAreaValue);
      };

      var loadSelect = function ( selectBox ){
        var selectId = $(selectBox).attr("id");
        var selectedValue = localStorage.getItem(formId + "." + selectId);
        $(selectBox).find('option[value="' + selectedValue + '"]').attr("selected", "selected");
      };

      var loadMultipleSelect = function ( multipleSelectBox ){
        var selectId = $(multipleSelectBox).attr("id");
        var selectedValuesString = localStorage.getItem(formId + "." + selectId);
        var selectedValues = JSON.parse(selectedValuesString);
        for( var i=0; i<selectedValues.length; i++){
          var value = selectedValues[i];
          $(multipleSelectBox).find('option[value="' + value + '"]').attr("selected", "selected");
        }
      };

      $(possibleFormElement).find("input").each(
        function(index, input) {
          switch($(input).attr("type")){

            case "checkbox":
              loadCheckBox( input );
              $(input).on("change", function(){
                var checkBoxId = $(input).attr("id");
                var checkBoxValue = $(input).attr("checked");
                if(checkBoxValue == "checked"){
                  localStorage.setItem(formId + "." + checkBoxId, "true");
                } else {
                  localStorage.setItem(formId + "." + checkBoxId, "false");
                }
              });
            break;

            case "radio":
              // TODO : Could be improved, this will be called once
              // for every option, It only need to be called once.
              loadRadio( input );
              $(input).on("change", function(){
                var radioName = $(input).attr("name");
                var radioId = $(input).attr("id");
                localStorage.setItem(formId + "." + radioName, radioId);
              });
            break;

            default:
              loadStandardInput( input );
              $(input).on("change", function(){
                var inputId = $(input).attr("id");
                var inputValue = $(input).attr("value");
                localStorage.setItem(formId + "." + inputId, inputValue);
              });
            break;

          }
        }
      );

      $(possibleFormElement).find("textarea").each(
        function(index, textArea) {
          loadTextArea( textArea );
          $(textArea).on("blur", function(){
            var textAreaId = $(textArea).attr("id");
            var textAreaValue = $(textArea).attr("value");
            console.log(textAreaValue);
            localStorage.setItem(formId + "." + textAreaId, textAreaValue);
          });
        }
      );

      $(possibleFormElement).find("select").each(
        function(index, select) {
          if($(select).attr("multiple") === undefined){

            loadSelect(select);
            $(select).on("change", function(){
              var selectId = $(select).attr("id");
              $(select).find("option:selected").each( function(index, select){
                var selectedValue = $(select).attr("value");
                localStorage.setItem(formId + "." + selectId, selectedValue);
              });
            });

          } else {

            loadMultipleSelect(select);
            $(select).on("change", function(){
              var multipleSelectId = $(select).attr("id");
              var multipleSelectValues = [];
              $(select).find("option:selected").each( function(index, select){
                multipleSelectValues.push($(select).attr("value"));
              });
              localStorage.setItem(formId + "." + multipleSelectId, JSON.stringify(multipleSelectValues));
            });

          }
        }
      );

    });
  };
})( jQuery );
