/**
 * PC/Tablet/Mobile 判別リダイレクト
 * 
 * example.com に対しモバイルページは example.com/sp/ とした場合を想定。
 * モバイルページのディレクトリ名変更やタブレット向けの処理が必要な場合は編集して使用すること。
 */
(function () {

  var mobileDirName = 'sp';
  //var siteDomain = location.host;
  var siteDomain = location.host + '/vrmmo-project';
  //var path = location.pathname;
  var path = (location.pathname).replace( /\/vrmmo-project/g , "" ) ;
  var paramater = location.search;
  var hash = location.hash;
  var redirectUri = null;
  var redirectPath = null;
  var referrer = null;

  var _ua = (function (u) {
    return {
      Tablet: (u.indexOf('windows') !== -1 && u.indexOf('touch') !== -1)
      || u.indexOf('ipad') !== -1
      || (u.indexOf('android') !== -1 && u.indexOf('mobile') == -1)
      || (u.indexOf('firefox') !== -1 && u.indexOf('tablet') !== -1)
      || u.indexOf('kindle') !== -1
      || u.indexOf('silk') !== -1
      || u.indexOf('playbook') !== -1,
      Mobile: (u.indexOf('windows') !== -1 && u.indexOf('phone') !== -1)
      || u.indexOf('iphone') !== -1
      || u.indexOf('ipod') !== -1
      || (u.indexOf('android') !== -1 && u.indexOf('mobile') !== -1)
      || (u.indexOf('firefox') !== -1 && u.indexOf('mobile') !== -1)
      || u.indexOf('blackberry') !== -1
    }
  })(window.navigator.userAgent.toLowerCase());


  var matchMobilePath = new RegExp('^\/' + mobileDirName + '\/');
  
  if (path.match(matchMobilePath)) {
    
    if (_ua.Mobile !== true) {
      redirectPath = path.substr(mobileDirName.length+1);
      redirectUri = '//' + siteDomain + redirectPath + paramater;
      
      // リファラー引継ぎ（ga関数別途設置必要あり）
      if (document.referrer) {
        referrer = 'referrer=' + encodeURIComponent(document.referrer);
        redirectUri = redirectUri + (paramater ? '&' : '?') + referrer;
      }
          
      //ハッシュありの場合
      if (hash) {
        redirectUri = redirectUri + hash;
      }
    
      location.href = redirectUri;
      
    }   
      
  } else {

    if (_ua.Mobile) {
      redirectPath = '/' + mobileDirName + path;
      redirectUri = '//' + siteDomain + redirectPath + paramater;
      
      // リファラー引継ぎ（ga関数別途設置必要あり）
      if (document.referrer) {
        referrer = 'referrer=' + encodeURIComponent(document.referrer);
        redirectUri = redirectUri + (paramater ? '&' : '?') + referrer;
      }
          
      //ハッシュありの場合
      if (hash) {
        redirectUri = redirectUri + hash;
      }
    
      location.href = redirectUri;
        
    }
    
  }

})();
