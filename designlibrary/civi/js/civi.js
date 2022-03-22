/*
* @data 2020-10-15
* Author: Katie Lu #7708
*
* E.SUN Design LIbrary JS
-----------------------------------
   Main
-----------------------------------
*/ 
    $(document).ready(function(){
    
        
    // Tab 頁籤選單      
        
            /* Variables */
            var clickedTab = $(".formTab > .active");
            var tabWrapper = $(".tab__content");
            var activeTab = tabWrapper.find(".active");
            var activeTabHeight = activeTab.outerHeight();

            /* Load 進來就顯示Tab */
            activeTab.show();                           

            /* Load 進來就顯示Tab高度 */
            tabWrapper.height(activeTabHeight);
            
            /* 點選作用 */
            $(".formTab > li").on("click", function() {        
                $(".formTab > li").removeClass("active");   /* Remove class from active tab */
                $(this).addClass("active");                 /* Add class active to clicked tab */
                clickedTab = $(".formTab .active");         /* Update clickedTab variable */
                
                activeTab.fadeOut(250, function() {                   /* fade out active tab */
                    $(".tab__content > li").removeClass("active");    /* Remove active class all tabs */
                    var clickedTabIndex = clickedTab.index();         /* Get index of clicked tab */
                    $(".tab__content > li").eq(clickedTabIndex).addClass("active"); // Add class active to corresponding tab */
                    activeTab = $(".tab__content > .active");         /* update new active tab */
                    activeTabHeight = activeTab.outerHeight();        /* Update variable */
                
                    tabWrapper.stop().delay(50).animate({            /* Animate height of wrapper to new tab height */
                        height: activeTabHeight
                    }, 500, function() {
                        activeTab.delay(50).fadeIn(250);                /* Fade in active tab   */
                    });
                });
            });


    });   // Document function End