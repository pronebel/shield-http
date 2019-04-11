## shield-http
  - report  : 实例重载
  - 交互: loading,alert
  - code 
  - error 
  - cache
  - loading
  - queue
  - auth行为: 通过具体的请求的options进行配置,在请求实例里面进行定义auth获取
  - 重复点击的问题
  - 取消请求的交互   √
  
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



  ```
