$(function(){
    // 1.1获取裁剪区域的DOM元素
    var $image=$('#image')
    // 1.2配置选项
    const options={
        // 纵横比
        aspectRatio:1,
        // 指定预览区域
        preview:'.img-preview'
    }

    // 1.3创建裁剪区域
    $image.cropper(options)


    // 为上传按钮绑定点击事件
    $('#btnChooseImage').on('click',function(){
        $('#file').click()
    })

    // 为文件选择框绑定change事件
    $('#file').on('change',function(e){
        var filelist=e.target.files;
        // console.log(filelist);
        if(filelist.length===0){
            return layui.layer.msg('请选择照片！');
        }

        // 1.拿到用户选择的文件
        var file=e.target.files[0];
        // 2.将文件，转化为路径
        var imageURL= URL.createObjectURL(file);
        // 3.重新初始化裁剪区域
        $image.cropper('destroy')  //销毁旧的裁剪区域
        .attr('src',imageURL)   //重新设置图片的路径
        .cropper(options)   //重新初始化裁剪区域
    })

    // 为确定按钮，绑定点击事件
    $('#btnUpload').on('click',function(){
        // 1.拿到用户裁剪之后的头像
        var dataURL=$image.cropper('getCroppedCanvas',{
            // 创建一个Cancas画布
            width:100,
            height:100
        }).toDataURL('image/png')   //将Canvas画布上的内容转化为base64格式的字符串
        // 2.调用接口,把头像上传到服务器
        $.ajax({
            method:'POST',
            url:'/my/update/avatar',
            data:{
                avatar:dataURL
            },
            success:function (res) {
                if(res.status!==0){
                    return layui.layer.msg('更换头像失败！')
                }
                layui.layer.msg('更换头像成功！');
                window.parent.getUserInfo();
            }
        })
    })
})