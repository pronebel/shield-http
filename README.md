## shield-http

  - code
  - error 
  - cache
  - loading
  - queue
  
  
  - 基于ajax下载文件(图片,excel,csv)的最佳实践封装
  - 短轮询的实现
  -  Rest便捷的接口实现
  
  - 分页的ajax的获取封装


### Code 

code定义

    code =[
      {
        val: 'val',
        message: "msg"
      }
    ]


https://github.com/AngelAngelov/ajax-file-downloader/blob/master/lib/ajax-file-downloader.js


#### 思考

- 基础header的上浮到http的实例从去构建


# Auth 需要的基础类



  ```
  
  export let getToken = function () {
  
  }
  export let setToken = function (token) {
  
  }
  export let clear = function () {
   
  }
  
  ```
