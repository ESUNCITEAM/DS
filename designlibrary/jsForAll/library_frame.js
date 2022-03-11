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
    

    //Side Menu
        $(".withSubMenu").click(function(){
            $(this).toggleClass("select");
        });
        
        $(".sideSubMenu li").click(function(){
            $(this).addClass("select");
            $(this).siblings().removeClass("select");
            $(this).parents().children("li").removeClass("select").css({color:"#red"});
        });

    //Scroll & Fix Menu
        $(window).scroll(function() {
            if ($(this).scrollTop() > 55)  {          /* 要滑動到選單的距離 */
               $('.formTab').addClass('stickyTab');   /* 幫選單加上固定效果 */
               $('.formTab > li').addClass('stickyTabStyle')
            } else {
              $('.formTab').removeClass('stickyTab'); /* 移除選單固定效果 */
              $('.formTab > li').removeClass('stickyTabStyle')
            }
          });
    
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
            $(".formTab > li").removeClass("active");              /* Remove class from active tab */
            $(this).addClass("active");                           /* Add class active to clicked tab */
            clickedTab = $(".formTab .active");                   /* Update clickedTab variable */
            
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

        //頁簽點選滑動到內容頂端
        var inner_content_top = $('.breadcrumbContainer').offset().top;
        $('.formTab > li.stickyTabStyle').click(function () {
        $('html,body').animate({scrollTop:inner_content_top},500);
        })

        // Scroll & Fix Menu ( 滾動 tab 貼齊 NEW )
        $(window).scroll(function() {
            if ($(this).scrollTop() > 55)  {          /* 要滑動到選單的距離 */
            $('.tab').addClass('stickyTab');   /* 幫選單加上固定效果 */
            $('.tablinks').addClass('stickyTabStyle')
            } else {
            $('.tab').removeClass('stickyTab'); /* 移除選單固定效果 */
            $('.tablinks').removeClass('stickyTabStyle')
            }
        });





    });   // Document function End



    

      
    

    
    



