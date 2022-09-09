修改了jquery.ztree.core.js中，大概在1087行，
添加了如下代码
beforeSend: function (XMLHttpRequest) {
  XMLHttpRequest.setRequestHeader(tokenKeyName, setting.async.token);
},
