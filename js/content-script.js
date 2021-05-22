$(function() {
	// 进入页面
	console.log("进入自动刷课程序！");
	// 获取课程ID的正则表达式
	let wlan = /VideoCollectionID=(\d+)/
	// 获取当前页面网址
	let selfurl = window.location.href;
	// 当前课程ID
	let playID = wlan.exec(selfurl)[1];
	// 获取课程元素
	let video = $("li.chapterConts");
	// 保存未刷课程信息
	let infos = [];
	for (let v of video) {
		let href = $(v).children("a").attr("href");
		let url = "https://hnwledu.ls365.net" + href.trim();
		let id = wlan.exec(href)[1];
		let obj = {
			"name": $(v).children("p").eq(0).children("span").text(),
			"speed": $(v).children("p").eq(1).children("img").attr("title"),
			"url": url,
			"id": id,
			"link": $(v).children("a")
		}
		if(obj.speed !== "100%"){
			infos.push(obj);
		}
	}
	// 获取当前需要刷的课
	let play = infos[0]
	if(playID !== play.id) {
		self.location.href=play.url
	}

	let auto = $("video")[0];
	$(auto).prop('muted', true);
	let outter = $("div.outter");

	// 等待视频加载完毕
	if($("video")[0].readyState=="complete"||$("video")[1].readyState=="loaded"){
		console.log("视频已加载完毕");
	}

	// 延迟播放
	setTimeout(function(){
		console.log("延迟播放");
		// 初始化加载
		if(/rmd/.exec(selfurl) !== null) {
			self.location.href=play.url
		}else{
			console.log("播放视频");
			// $(outter[0]).trigger('click')
			$(auto).trigger('play');
			// $(auto).trigger('pause');
			// $("video")[0].playbackRate = 2
			// $("video")[1].playbackRate = 2
			// $(auto).play()
		}
	},2000);
	
	// console.log($("video"));
	// setInterval(function(){
	// 	// 循环改变视频速率
	// 	// $("video")[0].playbackRate = 5
	// 	console.log("视频以加速处理");
	// 	console.log($("video")[0]);
	// 	console.log($("video")[1]);
	// },10000)
	
});
