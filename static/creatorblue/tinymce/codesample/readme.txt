修改方法  insertCodeSample : 在pre后添加 <p></p> 使其换行   ============
editor.insertContent('<pre id="__new" class="language-' + language + '">' + code + '</pre>');  
修改为
editor.insertContent('<pre id="__new" class="language-' + language + '">' + code + '</pre><p></p>');

==============================================================

修改方法  getCurrentLanguage   在方法里面 第一行添加    ============
// 修改 begin，代码编辑器的类型选择一次后固定，保存上一次选择
      fallback = localStorage.getItem('tinymce_code_language') || fallback;
      // 修改 end，代码编辑器的类型选择一次后固定，保存上一次选择

==============================================================

在 open 方法里面的 onSubmit  子方法 添加 ，大概 在 1677 行  ============
// 修改 开始，代码编辑器的类型选择一次后固定，保存上一次选择
          localStorage.setItem('tinymce_code_language', data.language);
          // 修改 结束，代码编辑器的类型选择一次后固定，保存上一次选择