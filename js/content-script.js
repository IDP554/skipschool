// 等待 DOM 加载完毕
ready(function(){
	// 获取当前页面网址
	let selfurl = window.location.href;
	// 检测是否是刷课页面
	let skipschool = /VideoCollectionID/
	if (null == skipschool.exec(selfurl)) {
		return;
	}
	// 进入页面
	console.log("进入自动刷课程序！");
	
	// 获取课程ID的正则表达式
	let wlan = /VideoCollectionID=(\d+)/
	// 当前课程ID
	let courseID = wlan.exec(selfurl)[1];
	// 获取课程元素
	let videos = $("li.chapterConts");
	// 保存未刷课程信息
	var infos = [];
	for (let v of videos) {
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

	if(infos.length == 0) {
		console.log("此学科已学完！");
		alert("此学科已学完！");
		return;
	}

	// 跳转到未刷完的课程页
	let skip = infos[0]
	if(courseID !== skip.id) {
		self.location.href=skip.url
	}

	// 赋值下一节课程对象
	var nextobj;
	if(infos.length > 1) {
		nextobj = infos[1]
	}

	// 等待视频加载完毕
	let intervalID = setInterval(() => {
		if($("video")[0].readyState==4) {
			console.log("视频加载完毕");
			clearInterval(intervalID);
			autoplay();
		}
	}, 1000);




	var autoplay = function(){
		console.log("开始刷课...");

		// 获取视频对象
		let video = $("video")[0];

		// 默认静音处理(谷歌66版本后想要视频自动播放需静音)
		$(video).prop('muted', true);
		$($("video")[1]).prop('muted', true); // 补充静音

		// 判断课程ID是否对应
		if(/rmd/.exec(selfurl) !== null) {
			self.location.href=skip.url
		}else{
			$(video).trigger("play")
			video.playbackRate = 1
		}

		// 监听视频是否播放
		let reset = setInterval(() => {
			if(video.paused) {
				clearInterval(reset);
				// 视频监听
				monitor();
			}
		}, 1000);
	}


	var monitor = function() {
		// 视频刷新重新赋值
		let video = $("video")[0];
		$(video).prop('muted', true);
		if(video.paused) {
			$(video).trigger("play")
		}


		// 循环监听
		let handle = setInterval(() => {
			if(video.paused && $("div#reader_msgbg").css("display")=="none") {
				let stop = confirm("视频被检测到已暂停！是否恢复播放！");
				if(!stop) {
					clearInterval(handle);
					alert("已关闭自动刷课，再次开启自动刷课需刷新页面。");
				}else{
					$(video).trigger("play")
				}
			}else if($("div#reader_msgbg").css("display")=="block"){
				// 此课程刷完，自动下一节
				clearInterval(handle);
				if(null !== nextobj.url) {
					self.location.href=nextobj.url
				}
			}else if(video.readyState==4) {
				if(video.playbackRate < 10){
					console.log("视频已加速至10倍速！");
					video.playbackRate = 10
				}
			}
		}, 1000);
	}
});