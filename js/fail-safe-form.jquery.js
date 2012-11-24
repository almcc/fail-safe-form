(function( $ ) {
  $.fn.failSafeForm = function( options ) {

    // Create some defaults, extending them with any options that were provided
    var settings = $.extend( {
      'validate' : false
    }, options);

    return this.each(function(index, element) {

      var formId = $(element).attr("id");

      var loadTextBox = function( element ){
        var elementId = $(element).attr("id");
        var elementValue = localStorage.getItem(formId + "." + elementId);
        $(element).attr("value", elementValue);
      };

      var loadCheckBox = function( element ){
        var elementId = $(element).attr("id");
        var elementValue = localStorage.getItem(formId + "." + elementId);
        if(elementValue == "true"){
          $(element).attr("checked","checked");
        } else {
          $(element).removeAttr("checked");
        }
      };

      var loadRadio = function( element ){
        var elementId = $(element).attr("name");
        var elementValue = localStorage.getItem(formId + "." + elementId);
        $("#" + elementValue).attr("checked","checked");
      };

      var loadTextArea = function( element ){
        var elementId = $(element).attr("id");
        var elementValue = localStorage.getItem(formId + "." + elementId);
        $(element).attr("value", elementValue);
      };

      var loadSelect = function ( element ){
        var elementId = $(element).attr("id");
        var elementValue = localStorage.getItem(formId + "." + elementId);
        $(element).find('option[value="' + elementValue + '"]').attr("selected", "selected");
      };

      var loadMultipleSelect = function ( element ){
        var elementId = $(element).attr("id");
        var elementValue = localStorage.getItem(formId + "." + elementId);
        var elementValues = JSON.parse(elementValue);
        for( var i=0; i<elementValues.length; i++){
          var value = elementValues[i];
          $(element).find('option[value="' + value + '"]').attr("selected", "selected");
        }
      };

      $(element).find("input").each(
        function(index, element) {
          switch($(element).attr("type")){
            case "text":
              loadTextBox( element );
              $(element).on("blur", function(){
                var elementId = $(element).attr("id");
                var elementValue = $(element).attr("value");
                localStorage.setItem(formId + "." + elementId, elementValue);
              });
            break;

            case "checkbox":
              loadCheckBox( element );
              $(element).on("click", function(){
                var elementId = $(element).attr("id");
                var elementValue = $(element).attr("checked");
                if(elementValue == "checked"){
                  localStorage.setItem(formId + "." + elementId, "true");
                } else {
                  localStorage.setItem(formId + "." + elementId, "false");
                }
              });
            break;

            case "radio":
              // TODO : Could be improved, this will be called once
              // for every option, It only need to be called once.
              loadRadio( element );
              $(element).on("click", function(){
                var elementId = $(element).attr("name");
                var elementValue = $(element).attr("id");
                localStorage.setItem(formId + "." + elementId, elementValue);
              });
            break;
          }
        }
      );

      $(element).find("textarea").each(
        function(index, element) {
          loadTextArea( element );
          $(element).on("blur", function(){
            var elementId = $(element).attr("id");
            var elementValue = $(element).attr("value");
            console.log(elementValue);
            localStorage.setItem(formId + "." + elementId, elementValue);
          });
        }
      );

      $(element).find("select").each(
        function(index, element) {
          if($(element).attr("multiple") === undefined){

            loadSelect(element);
            $(element).on("change", function(){
              var elementId = $(element).attr("id");
              $(element).find("option:selected").each( function(index, element){
                var elementValue = $(element).attr("value");
                localStorage.setItem(formId + "." + elementId, elementValue);
              });
            });

          } else {

            loadMultipleSelect(element);
            $(element).on("change", function(){
              var elementId = $(element).attr("id");
              var elementValue = [];
              $(element).find("option:selected").each( function(index, element){
                elementValue.push($(element).attr("value"));
              });
              localStorage.setItem(formId + "." + elementId, JSON.stringify(elementValue));
            });

          }
        }
      );

    });
  };
})( jQuery );
