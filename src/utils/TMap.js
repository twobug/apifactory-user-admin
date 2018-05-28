export function TMap() {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(qq)//注意这里
    };
    //腾讯地图 key  http://lbs.qq.com/javascript_v2/index.html
    let key = 'TJ3BZ-6LVCF-C25JP-JOA3O-EWZFJ-5FBMI',
      script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `http://map.qq.com/api/js?v=2.exp&callback=init&key=${key}&libraries=drawing,geometry,autocomplete,convertor`;
    script.onerror = reject;
    document.head.appendChild(script);
  })
}
