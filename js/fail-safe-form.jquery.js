(function( $ ) {
  $.fn.failSafeForm = function() {

    return this.each(function(index, possibleFormElement) {

      var formId = $(possibleFormElement).attr("id");

      var loadCheckBox = function( checkBoxItem ){
        var checkBoxId = $(checkBoxItem).attr("id");
        var isChecked = localStorage.getItem(formId + "." + checkBoxId);
        if(isChecked == "true"){
          $(checkBoxItem).attr("checked","checked");
        } else {
          $(checkBoxItem).removeAttr("checked");
        }
      };

      var persistCheckBox = function(){
        console.log("persistCheckBox");
        var checkBoxId = $(this).attr("id");
        var checkBoxValue = $(this).attr("checked");
        if(checkBoxValue == "checked"){
          localStorage.setItem(formId + "." + checkBoxId, "true");
        } else {
          localStorage.setItem(formId + "." + checkBoxId, "false");
        }
      };

      var loadRadio = function( radioPart ){
        var radioSetName = $(radioPart).attr("name");
        var radioPartId = localStorage.getItem(formId + "." + radioSetName);
        $("#" + radioPartId).attr("checked","checked");
      };

      var persistRadio = function(){
        var radioName = $(this).attr("name");
        var radioId = $(this).attr("id");
        localStorage.setItem(formId + "." + radioName, radioId);
      };

      var loadStandardInput = function( input ){
        var inputId = $(input).attr("id");
        var value = localStorage.getItem(formId + "." + inputId);
        $(input).attr("value", value);
      };

      var persistStandardInput =  function(){
        var inputId = $(this).attr("id");
        var inputValue = $(this).attr("value");
        localStorage.setItem(formId + "." + inputId, inputValue);
      };

      var loadTextArea = function( textArea ){
        var textAreaId = $(textArea).attr("id");
        var textAreaValue = localStorage.getItem(formId + "." + textAreaId);
        $(textArea).attr("value", textAreaValue);
      };

      var persistTextArea = function(){
        var textAreaId = $(this).attr("id");
        var textAreaValue = $(this).attr("value");
        console.log(textAreaValue);
        localStorage.setItem(formId + "." + textAreaId, textAreaValue);
      };

      var loadSelect = function ( selectBox ){
        var selectId = $(selectBox).attr("id");
        var selectedValue = localStorage.getItem(formId + "." + selectId);
        $(selectBox).find('option[value="' + selectedValue + '"]').attr("selected", "selected");
      };

      var persistSelect = function(){
        var selectId = $(this).attr("id");
        $(this).find("option:selected").each( function(index, select){
          var selectedValue = $(select).attr("value");
          localStorage.setItem(formId + "." + selectId, selectedValue);
        });
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

      var persistMultipleSelect = function(){
        var multipleSelectId = $(this).attr("id");
        var multipleSelectValues = [];
        $(this).find("option:selected").each( function(index, select){
          multipleSelectValues.push($(select).attr("value"));
        });
        localStorage.setItem(formId + "." + multipleSelectId, JSON.stringify(multipleSelectValues));
      };

      var clearAll = function()
      {
        // Clear all local storage
      };

      var clearLocalStorage = function()
      {

      };

      $(possibleFormElement).find("input").each(
        function(index, input) {
          switch($(input).attr("type")){
            case "checkbox":
              loadCheckBox( input );
              $(input).on("change", persistCheckBox);
            break;
            case "radio":
              // TODO : Could be improved, this will be called once
              // for every option, It only need to be called once.
              loadRadio( input );
              $(input).on("change", persistRadio);
            break;
            case "file":
              // <input type="file" /> not supported.
            break;
            case "password":
              // <input type="password" /> ignored.
            break;
            case "button":
              // <input type="button" /> ignored.
            break;
            case "reset":
              clearAll();
            break;
            case "submit":
              clearLocalStorage();
            break;
            default:
              loadStandardInput( input );
              $(input).on("change", persistStandardInput);
            break;
          }
        }
      );

      $(possibleFormElement).find("textarea").each(
        function(index, textArea) {
          loadTextArea( textArea );
          $(textArea).on("blur", persistTextArea);
        }
      );

      $(possibleFormElement).find("select").each(
        function(index, select) {
          if($(select).attr("multiple") === undefined){
            loadSelect(select);
            $(select).on("change", persistSelect);
          } else {
            loadMultipleSelect(select);
            $(select).on("change", persistMultipleSelect);
          }
        }
      );
    });
  };
})( jQuery );
