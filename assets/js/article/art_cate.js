$(function (){
    initArtCateList();
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function (res) {
                var htmlStr= template('tpl-table',res)
                $('tbody').html(htmlStr);
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd=null;
    $('#btnAddCate').on('click',function () {
        indexAdd= layui.layer.open({
            type:1,
            area:['500px','250px'],
            title:'添加文章分类',
            content:$('#dialog-add').html()
        })
    })

    // 通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit','#form-add',function (e) {
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function (res) {
                if(res.status!==0){
                    return layui.layer.msg('新增分类失败')
                }
                initArtCateList();
                layui.layer.msg('新增分类成功')
                // 根据索引关闭对应的弹出层
                layui.layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式，为btn-edit按钮绑定点击事件
    var indexEdit=null;
    $('tbody').on('click','.btn-edit',function(){
        // 弹出一个修改文章分类信息的曾层
        indexEdit= layui.layer.open({
            type:1,
            area:['500px','250px'],
            title:'修改文章分类',
            content:$('#dialog-edit').html()
        })
        var id=$(this).attr('data-id')
        // console.log(id);
        // 发起请求获取对应分类的数据
        $.ajax({
            method:'GET',
            url:'/my/article/cates/' + id,
            success:function(res){
                layui.form.val('form-edit',res.data)
                // console.log(res);
            }
        })
    })

    // 通过代理的形式，为修改分类的表单绑定submit事件
    $('tbody').on('submit','#form-edit',function(e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!=0){
                    return layui.layer.msg('更新分类数据失败！')
                }
                layui.layer.msg('更新分类数据成功');
                layui.layer.close(indexEdit)
                initArtCateList();
            }
        })
    })
    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click','.btn-delete',function(){
        var id=$(this).attr('data-id');
        // 提示用户是否要删除
        layui.layer.confirm('确认删除',{icon:3,title:'提示'},
        function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+id,
                success:function(res){
                    if(res.status!=0){
                        return layui.layer.msg('删除分类失败')
                    }
                    layui.layer.msg('删除分类成功')
                    layui.layer.close(index);
                    initArtCateList();
                }
            })

        }
        )
    })
})