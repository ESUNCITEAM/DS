/*
* @data 2021-10-07
* Author: Alyshia Lee #7711
*
* E.SUN CreditCard CBP JS
-----------------------------------
   Loading
-----------------------------------
*/ 
        $(document).ready(function(){
            lottie.loadAnimation({
                wrapper: lottieLoadingSimple,
                animType: 'svg',
                loop: true,
                // path: 'https://assets5.lottiefiles.com/packages/lf20_54fmwlpv.json'
                path: 'js/esun_cbp2_loading.json'
            });
            lottie.loadAnimation({
                wrapper: lottieLoadingShade,
                animType: 'svg',
                loop: true,
                // path: 'https://assets5.lottiefiles.com/packages/lf20_54fmwlpv.json'
                path: 'js/esun_cbp2_loading.json'
            });
        });