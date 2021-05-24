$(function(){
	var end = true;
	// 导航栏
	$("#nav ul").children().click(function(){
		if(end) {
			end = false;
			$(this).addClass("selected");
			$(this).siblings().removeClass("selected");
			$("progress").animate({width:'show',value:'100'},800,function(){
				$(this).attr("value","0");
				$(this).hide();
				end = true;
			});
		}
	});
	
	// 搜索按钮
	$("input.search").click(function(){
		let keyword = $("input:text").val();
		if(keyword == "") {
			
		}
		if(keyword == "MortarStudio") {
			return;
		}
		window.open("https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd="+keyword+"&fenlei=256&rsv_pq=bf6fe4bd0002a7fa&rsv_t=98d8ndwFdJys69xR1nUBg4ddUh8B%2Bn3EFYeBjM9saTSazyhdtaHaKj7N248&rqlang=cn&rsv_enter=1&rsv_dl=ib&rsv_sug3=10&rsv_sug1=7&rsv_sug7=101");
	});
	
	// 充电按钮
	$("#status ul li:last-child").click(function(){
		$(this).toggle();
	});
	$("#status ul li").eq(7).click(function(){
		$("#status ul li:last-child").toggle();
	});
	
	// 改变时间
	setInterval(function(){
		var h = new Date().getHours();//获取当前小时数(0-23)
		var m = new Date().getMinutes();//获取当前分钟数(0-59)
		$("#status ul li").eq(3).text((h<10?"0"+h:h)+":"+(m<10?"0"+m:m));
	},1000);
	
	// 点击麦克风
	$(".Micro").click(function(){
		alert("未检测到麦克风!");
	});
	
});