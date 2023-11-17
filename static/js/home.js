$(function(){

	// 弹窗关闭
	$("div.foot img").click(function(){
		$(".mengban").hide();
	});


	var end = true;
	// 导航栏
	$("#nav ul").children().click(function(){
		if(end) {
			end = false;
			$(this).addClass("selected");
			$(this).siblings().removeClass("selected");
			let num = $(this).attr("value");
			console.log(num);
			$("progress").animate({width:'show',value:'100'},800,function(){
				$(this).attr("value","0");
				$(this).hide();
				$("#list").children().eq(num).show();
				$("#list").children().eq(num).siblings().hide();
				end = true;
			});
		}
	});
	
	var tip = ["这还用问？","嘿嘿，不告诉你","你真想知道？","关注李大炮工作室寻找答案！","你还问？","说实话，挺帅的！","能不能换个别的搜？"];
	var i = 0;
	// 搜索按钮
	$("input.search").click(function(){
		let keyword = $("input:text").val();
		if(keyword == "") {
			if(end) {
				end = false;
				$("input[type='text']").focus();
				$("input[type='text']").attr("placeholder", tip[i]);
				i = i>tip.length?0:i+1;
				error("twinkle", 5);
				setTimeout(() => {
					$("input[type='text']").attr("placeholder", "李大炮帅吗？");
					end = true;
				}, 1500);
			}
			return;
		}
		i=0;
		if(keyword == "MortarStudio") {
			if(end) {
				end = false;
				$("#nav ul li").eq(0).addClass("selected");
				$("#nav ul li").eq(0).siblings().removeClass("selected");
				$("progress").animate({width:'show',value:'100'},800,function(){
					$(this).attr("value","0");
					$(this).hide();
					end = true;
				});
			}
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

	// 输入框闪烁
	function normal(id, times) {
		var obj=$("#"+id);
		obj.removeClass("placeholder");
		if(times < 0) {  
			return;  
		}  
		times=times-1;  
		setTimeout(function(){
			error(id, times);
		},200);  
	}

	function error(id, times) {  
		var obj=$("#"+id);  
		obj.addClass("placeholder");
		times=times-1;  
		setTimeout(function(){
			normal(id, times)
		}, 200);  
	}
	
});