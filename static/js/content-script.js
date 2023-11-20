// 等待 DOM 加载完毕
ready(function(){
	// 获取当前地址框
	let selfurl = window.location.href;
	// 网址前缀
	let analysis = /https:\/\/[\w.]+/
	let urlHead = analysis.exec(selfurl)[0];
	// 根据网站进入不同脚本
	switch(urlHead) {
		case 'https://hnwledu.ls365.net':
			console.log("识别为湖南文理");
			hunan(selfurl, urlHead);
			break;
		case 'https://huse.ls365.net':
			console.log("识别为湖南科技");
			hunan(selfurl, urlHead);
			break;
		case 'https://bx.bossyun.com':
			console.log("识别为博学BX");
			boxue(selfurl);
			break;
	}
});

// 湖南文理, 湖南科技 刷课逻辑
function hunan(selfurl, urlHead) {

	// 检测是否是刷课页面
	let skipschool = /VideoCollectionID/
	if (null == skipschool.exec(selfurl)) {
		return;
	}
	// 进入页面
	console.log("进入自动刷课程序");	
	
	// 保存未刷课程信息
	let infos = [];
	// 记录已刷课数量
	let skipcnt = 0;
	// 当前课程ID
	let wlan = /VideoCollectionID=(\d+)/; // 获取课程ID的正则表达式
	let courseID = wlan.exec(selfurl)[1];
	// 获取课程信息
	let videos = $("li.chapterConts"); // 课程信息所在dom

	// 全局索引(当前索引)
	let index = 1
	// 课程对象索引
	let i = 0
	for (const v of videos) {
		i++;
		let href = $(v).children("a").attr("href");
		let url = urlHead + href.trim();
		let id = wlan.exec(href)[1];
		let obj = {
			"name": $(v).children("p").eq(0).children("span").text(), // 课程名
			"speed": $(v).children("p").eq(1).children("img").attr("title"), // 课程进度
			"url": url, // 课程链接
			"id": id,   // 课程id
			"index": i, // 索引
			"link": $(v).children("a")
		}
		if(obj.speed == "100%") {
			skipcnt++
		}
		// 进度为0的课程无法匹配课程id,所以当前索引需设置为1
		if(obj.id == courseID) {
			index = i
		}
		infos.push(obj);
	}
	// 当视频总数等于已刷完课程数时，停止向下执行
	if(infos.length == skipcnt) {
		alert("此学科已学完！");
		console.log('此学科已学完！')
		return;
	}
	// 跳转到未刷完的课程页(从当前课程往下判断)
	// 可以在遇到错误课程资源时，点击下一节课继续进行自动刷课
	if(infos[index-1].speed == "100%") {
		for (const f of infos) {
			// 判断当前课程是否学完
			if(f.index > index && f.speed != "100%"){
				// 跳转到下一个未学完课程
				self.location.href = f.url
				break;
			}
		}
	}

	// 赋值下一节课程对象
	var nextobj ;
	if(infos.length !== index) {
		nextobj = infos[index]
	} else {
		// 刷到最后一节课时，赋值第一节课程
		// 便于从头开始重新遍历一下课程是否已刷完
		nextobj = infos[0]
	}

	/** readyState 
	 * 0 没有关于音频/视频是否就绪的信息
	 * 1 关于音频/视频就绪的元数据
	 * 2 关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒
	 * 3 当前及至少下一帧的数据是可用的
	 * 4 可用数据足以开始播放
	 */
	// 等待视频加载完毕
	let intervalID = setInterval(() => {
		if($("video")[0].readyState == 4) {
			console.log("视频加载完毕");
			clearInterval(intervalID);
			autoplay();
		}
	}, 1000);

	// 刷课前处理视频自动播放
	var autoplay = function(){
		// 获取视频对象
		let video = $("video")[0];

		// 默认静音处理(谷歌66版本后想要视频自动播放需静音)
		$(video).prop('muted', true);
		$($("video")[1]).prop('muted', true); // 补充静音

		// 播放
		$(video).trigger("play")
		// playbackRate 视频播放速率
		video.playbackRate = 1
		console.log("脚本载入...");
		// 获取开头视频blob
		let blob = $(video).attr('src');

		// 尝试重新播放次数，避免遇到错误后一直循环
		let forcnt = -10;
		// 等待第一个视频播放完毕后清除定时器（非课程视频）
		let reset = setInterval(() => {
			if (forcnt < 0) {
				// 当视频的来源值变动时，第一个视频播放完毕
				let b = $($("video")[0]).attr('src');
				if(blob != b) {
					clearInterval(reset);
					// 视频监听(延迟进入：避免程序执行过快，视频元素还未加载完成)
					setTimeout(skip(), 1000);
				}
			} else {
				// 刷新页面
				location.reload(true)
			}
		}, 2000);
	}

	// 目标视频刷课
	var skip = function() {
		console.log("开始刷课");
		// 重新获取视频对象
		let video = $("video")[0];
		// 进行播放
		$(video).trigger("play");
		// 静音
		$(video).prop('muted', true);
		$($("video")[1]).prop('muted', true); // 补充静音
		// 尝试重新播放次数，避免遇到错误后一直循环
		let forcnt = -10;
		// 循环监听
		let handle = setInterval(() => {
			if(video.paused && $("div#reader_msgbg").css("display") == "none" && forcnt < 0) {
				forcnt++;
				// 尝试重新播放
				$(video).trigger("play");
				// 静音
				$(video).prop('muted', true);
				$($("video")[1]).prop('muted', true); // 补充静音
			} else if($("div#reader_msgbg").css("display") == "block"){
				// 此课程刷完，自动下一节
				clearInterval(handle);
				self.location.href = nextobj.url
			} else if(video.readyState == 4) {
				// 当视频倍速低于10倍速进行恢复
				if(video.playbackRate < 10){
					console.log("视频已加速至10倍速！");
					video.playbackRate = 10
				}
			} else if(forcnt >= 0) {
				console.log('刷课程序已暂停，请刷新页面！')
				clearInterval(handle);
			} else if ($(video).prop('muted') == false) {
				// 静音
				$(video).prop('muted', true);
				$($("video")[1]).prop('muted', true); // 补充静音
			}
		}, 2000);
	}
}

// 博学BX
function boxue(selfurl) {
	// 进入页面
	console.log("进入自动刷课程序");
	// 分析未完成课程
	if (!selfurl.includes("bx/live")) {
		let sub = $(".subcatalog-item");
		let interval = setInterval(() => {
			if(sub.length == 0){
				sub = $(".subcatalog-item");
			} else {
				clearInterval(interval);
				skip(sub);
			}
		}, 1000);	
	} else {
		setTimeout(() => {
			let video = $("video")[0];
			// 默认静音处理(谷歌66版本后想要视频自动播放需静音)
			// 新版谷歌需要进入 网站设置 > 声音 > 改为允许
			$(video).prop('muted', true);
			$(video).trigger("play")
			console.log("开始刷课...");
			// 16 倍速
			video.playbackRate = 16
			setInterval(() => {
				if(video.playbackRate < 16){
					console.log("视频已加速至16倍速！");
					video.playbackRate = 16
				}
			}, 1000);
		}, 5000);	
	}

	// 间隔10秒打开新窗口
	function skip(sub) {
		let i = 500;
		for (let v of sub) {
			let success = v.children[2].children[0];
			if(success.localName !== "img") {
				// 打开页面
				setTimeout(function(){
					$(v).click();
				}, i)
				i += 10000;
			}
		}
	}
}