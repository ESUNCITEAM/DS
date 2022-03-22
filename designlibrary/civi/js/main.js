/*
* @data 2020-8-11
* Author: Alyshia Lee #7711
*
* E.SUN CreditCard CBP JS
-----------------------------------
   Main
-----------------------------------
*/ 

      $(document).ready(function(){
         //Nav Extension Edit
         $("#btnNavExtensionEdit").click(function(){
            $(this).parents("#navExtensionField").toggleClass("editing");
            if( $(this).parents("#navExtensionField").hasClass("editing") ){
               $("#navExtension").prop("disabled", false);
            }else{
               $("#navExtension").prop("disabled", true);
            }
         });

         //Nav Extension Alert
         $("#btnNavExtensionEdit").click(function(){
            if( $("#navExtension").val() == "0000" ){
               $(".extensionAlert").addClass("show");
               $("#navExtension").prop("disabled", false);
               $(this).parents("#navExtensionField").toggleClass("editing");
            }else{
               $(".extensionAlert").removeClass("show");
            }
         })

         //Nav Notify Alert
         $("#btnNavNotify").click(function(){
            $(this).removeClass("alert");
         })

         //Side Menu
         // $(".sideMainMenu li").click(function(){
         // $(this).toggleClass("select");
         // $(this).siblings("li").removeClass("select");
         // $(this).siblings("li").children("ul").children("li").removeClass("select");   
         // });

         //Multiple Switch
         $(".multiSwitchOptField input").click(function(){
				if( $("#guideline_multiSwitch_2").is(":checked") ){
					$(".multiSwitch").addClass("status2");
				}else{
					$(".multiSwitch").removeClass("status2");
				}
				if( $("#guideline_multiSwitch_3").is(":checked") ){
					$(".multiSwitch").addClass("status3");
				}else{
					$(".multiSwitch").removeClass("status3");
				}
			});

         //Pager
         $(".pagerContainer li").click(function(){
            $(this).addClass("now");
            $(this).siblings("li").removeClass("now");
         });
         $(".pagerContainer.totalPageMore li.nextArrow").click(function(){
            $(this).parents("ul").removeClass("show");
            $(this).parents("ul").next("ul").addClass("show");
         });
         $(".pagerContainer.totalPageMore li.prevArrow").click(function(){
            $(this).parents("ul").removeClass("show");
            $(this).parents("ul").prev("ul").addClass("show");
         });

         //Datepicker
         $(".datepicker").siblings("button").click(datepickerIconClick);
         $(".datepicker").datepicker({
            inline: true,
         });
         $(".datepicker").datepicker("option", "dateFormat", "yy/mm/dd" ).val();

         //Timepicker
         $(".timepicker").kendoTimePicker({
            value: new Date(),
            format: "h:mm:ss tt",/*H:mm:ss*/
            componentType:"modern"
        });
         
         //Select
         $('.dropdownBtn').each(function() {
            $(this).children('select').css('display', 'none');
        
            var $current = $(this);
        
            $(this).find('option').each(function(i) {
              if (i == 0) {
              $current.prepend($('<div>', {
                class: $current.attr('class').replace(/dropdownBtn/g, 'dropdownBox')
              }));
              
              var placeholder = $(this).text();
              $current.prepend($('<span>', {
                class: $current.attr('class').replace(/dropdownBtn/g, 'dropdownPlaceholder'),
                text: placeholder,
                'data-placeholder': placeholder
              }));
              
              return;
              }
              
              $current.children('div').append($('<span>', {
              class: $current.attr('class').replace(/dropdownBtn/g, 'dropdownBoxOptions'),
              text: $(this).text()
              }));
            });
            });
            // Toggling the `.active` state on the `.dropdownBtn`.
            $('.dropdownBtn').click(function() {
            $(this).toggleClass('active');
            });

            // Toggling the `.active` state on the `.dropdownBtn`. (Clicking Outside)
            $(document).click(function(e){
               if($(e.target).is('.dropdownBtn, .dropdownBtn *'))return;
               $('.dropdownBtn').removeClass('active');
            });
        
            // Toggling the `.selected` state on the options.
            $('.dropdownBoxOptions').click(function() {
            var txt = $(this).text();
            var index = $(this).index();
        
            $(this).siblings('.dropdownBoxOptions').removeClass('selected');
            $(this).addClass('selected');
        
            var $currentSel = $(this).closest('.dropdownBtn');
            $currentSel.children('.dropdownPlaceholder').text(txt);
            $currentSel.children('select').prop('selectedIndex', index + 1);
         });
         $(".dropdownBtn").click(dropdownBtnClick);
         //Select With Search
         $(".selectWithSearch").select2({
            placeholder: "請選擇",
            allowClear: false,
            theme:"classic",
         });

         //Sortable Form
         $(".btnSort").click(function(){
               $(this).parents(".listSortable").addClass("sorting");
               $(this).parents(".sortableCell").parents(".formRow").siblings(".sortableZone").sortable();
               $(this).parents(".sortableCell").parents(".formRow").siblings(".sortableZone").sortable("option", "disabled", false);
               $(this).parents(".sortableCell").parents(".formRow").siblings(".sortableZone").disableSelection();
			});
			$(".btnSortSave").click(function(){
			   $(this).parents(".listSortable").removeClass("sorting");
            $(this).parents(".sortableCell").parents(".formRow").siblings(".sortableZone").sortable("disable");
         });

         //Form Label
         $(".formLabel").click(function(){
            $(this).addClass("select");
            $(this).siblings(".formLabel").removeClass("select");
         });

         //Popup
         $(".btnPopupClose").click(function(){
            $(this).parents(".popupContent").parents(".popupContainer").parents(".popup").removeClass("show");
         });

         //Quick Call
			$("button.btnKeypad").click(function(){
				var number = $(this).text();
				$(".callInputContainer input[type='text']").val(function() {
					return this.value + number;
				});
				if( !$(".callInputContainer input[type='text']").val() == 0 ){
					$(".btnPopupQuickCallClear").addClass("show");
				}else{
					$(".btnPopupQuickCallClear").removeClass("show");
				}
			});
			$(".callInputContainer input[type='text']").keyup(function(){
				if( !$(this).val() == 0 ){
					$(".btnPopupQuickCallClear").addClass("show");
				}else{
					$(".btnPopupQuickCallClear").removeClass("show");
				}
			});
			$(".btnPopupQuickCallClear").click(function(){
				$(".callInputContainer input[type='text']").val("");
				$(".btnPopupQuickCallClear").removeClass("show");
         });
         
         //Transfer Form All (Need to set each option too)
         ////Transfer From All
			$("input[type='checkbox'].transferFrom_All").click(function(){
				if( $(this).is(":checked") ){
					$("input[name='transferFromOption']").prop("checked", true);
					$("input[name='transferToOption']").prop("checked", true);
					$("input[type='checkbox'].transferTo_All").prop("checked", true);
				}else{
					$("input[name='transferFromOption']").prop("checked", false);
					$("input[name='transferToOption']").prop("checked", false);
					$("input[type='checkbox'].transferTo_All").prop("checked", false);
				}

				if( $("input[name='transferToOption']:checked").length > 0 ){
					$(".transferToEmptyText").removeClass("show");
				}else{
					$(".transferToEmptyText").addClass("show");
				}
			});
			////Transfer To All
			$("input[type='checkbox'].transferTo_All").click(function(){
				$("input[name='transferFromOption']").prop("checked", false);
				$("input[type='checkbox'].transferFrom_All").prop("checked", false);
				$("input[name='transferToOption']").prop("checked", false);

				if( $("input[name='transferToOption']:checked").length > 0 ){
					$(".transferToEmptyText").removeClass("show");
				}else{
					$(".transferToEmptyText").addClass("show");
				}
			});
      });


      function datepickerIconClick(){
         $(this).siblings(".datepicker").focus();
      };
      function dropdownBtnClick(){
         $(this).toggleClass("dropdownBtn-focus");
         $(this).siblings(".dropdownMenu").toggleClass("dropdownMenu-view");
      };