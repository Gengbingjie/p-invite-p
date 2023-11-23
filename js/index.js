// 判断是否为移动端
function isMobile() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
if (isMobile()) {
	// console.log("这是移动端");
	//判断手机横竖屏状态：
	function hengshuping() {
		if (window.orientation == 180 || window.orientation == 0) {
			$(".w_pop").hide()
		}
		if (window.orientation == 90 || window.orientation == -90) {
			$(".w_pop").show()
		}
		$("body,html").css("width", "7.5rem")
	}
	hengshuping()
	window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshuping, false);

	//ios端解决点击select页面上移的问题
	var stops;
	$('select,input').on('focus', function () {
		stops = $(window).scrollTop();
	})
	$('select,input').on('blur', function () {
		$(window).scrollTop(stops);
	})

	// $(".section1").prependTo(".wrap")

	// $(".right_txt,.pt_link").hide()
	// $(".right_box em").click(function(){
	// 	$(".right_txt,.pt_link").toggle()
	// 	$(".lang_list").hide()
	// })

	//第三屏轮播
	var swiper = new Swiper('.lb_con2 .swiper-container', {
		autoplay: 2500,
		autoplayDisableOnInteraction: false,
		loop: true,
		observer: true,
		observeParents: true,
		pagination: '.lb_con2 .swiper-pagination',
		paginationClickable: true,
		nextButton: '.lb_con2 .next',
		prevButton: '.lb_con2 .prev',
		onTransitionStart: function (swiper) {
			pauseVid()
			$(".lb_con2 .swiper-slide video").css("opacity", ".9")
			$(".lb_con2 .swiper-slide-active video").css("opacity", "1")
		}
	});
	//动画
	var wow = new WOW({
		boxClass: 'wow',
		animateClass: 'animated',
		offset: 0,
		mobile: true,
		live: true
	});
	wow.init();
} else {
	// console.log("这是PC端");
	$("#rp").fullpage({
		// anchors: ["page1", "page2", "page3"],
		// menu: "#menu",
		normalScrollElements: ".pop_box",
		onLeave: function (index, nextIndex, direction) {
			// console.log(direction + "+" + nextIndex)
			if (direction == "down" && nextIndex == 3) {
				$(".section3 .con").addClass("show")
			} else {
				$(".section3 .con").removeClass("show")
			}
		}
	});
	//自适应
	var gift = {
		init: function () {
			var sWidth = $(window).width(), sHeight = $(window).height();
			if (sWidth > 1920) {
				sWidth = 1920;
			}
			$(".con,.section0 .top_link,.section0 .logo,.pop_rule,.pop_qa,.pop_result").css({
				// transform:"scale("+sWidth/1920+")"
				zoom: sWidth / 1920
			});
			if (sWidth <= 1600) {
				sWidth = 1600;
			}
			$(".milestone_box").css({
				// transform:"scale("+sWidth/1920+")"
				zoom: sWidth / 1920
			});

			//2期背景适配
			var width = document.documentElement.clientWidth;
			var height = document.documentElement.clientHeight;
			if (width / height < 2.1) {
				$(".section0").css("background-size", "auto 100%")
			} else {
				$(".section0").css("background-size", "100% 100%")
			}
		}
	}
	gift.init();
	$(window).bind("resize", function () {
		gift.init();
	});
	$(".btn_top").on("click", function () {
		$.fn.fullpage.moveTo(1)
	})
	//第三屏轮播
	var swiper = new Swiper('.lb_con2 .swiper-container', {
		autoplay: 2500,
		autoplayDisableOnInteraction: false,
		loop: true,
		observer: true,
		observeParents: true,
		pagination: '.lb_con2 .swiper-pagination',
		paginationClickable: true,
		nextButton: '.lb_con2 .next',
		prevButton: '.lb_con2 .prev',
		effect: 'coverflow',
		centeredSlides: true,
		slidesPerView: 'auto',
		coverflow: {
			rotate: 0,
			stretch: 514,
			depth: 300,
			modifier: 1,
			slideShadows: false
		},
		onTransitionStart: function (swiper) {
			pauseVid()
			$(".lb_con2 .swiper-slide video").css("opacity", ".9")
			$(".lb_con2 .swiper-slide-active video").css("opacity", "1")
		}
	});
}

function pauseVid() {
	// 获取所有视频元素
	const videos = document.querySelectorAll('video');

	// 遍历视频元素，暂停它们的播放
	videos.forEach(video => {
		video.pause();
	});
}

//选中
$(".agree_check").click(function () {
	$(this).toggleClass("cur")
	$(".btn_submit").toggleClass("gray")
})

if ($(".lb_con1 .swiper-slide").length > 1) {
	//第二屏轮播
	var swiper = new Swiper('.lb_con1 .swiper-container', {
		autoplay: 2500,
		autoplayDisableOnInteraction: false,
		observer: true,
		observeParents: true,
		pagination: '.lb_con1 .swiper-pagination',
		paginationClickable: true
	});
} else {
	$(".lb_con1 .swiper-pagination").hide()
}


//弹窗
function TGDialogS(e) {
	closeDialog()
	$("#" + e).css("display", "block")
}
function closeDialog() {
	$(".pop_box").css("display", "none")
}

//传入成功和失败链接
var thisUrl = window.location;
// var thisUrl = "https://preregister.teamfighttactics.leagueoflegends.com/";
// console.log(thisUrl)
$("#successURL").val(thisUrl + "#RegisterSuccess")
$("#errorURL").val(thisUrl + "#RegisterError")
$(".input1").on('input', function (e) {
	$("#puuid").val($(".input1").val())
});
// if(thisUrl.hash=="#RegisterSuccess"){
// 	TGDialogS("pop2")
// }
// window.addEventListener('hashchange', function() {
//   if(thisUrl.hash=="#RegisterSuccess"){
//   	TGDialogS("pop2")
//   }
// }, false);

// 提交邮箱
$('.btn_submit').on('click', function (e) {
	var emailVal = $('#email').val()
	var emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailReg.test(emailVal)) {
		// 邮箱校验失败!
		TGDialogS("pop4")
		return false
	}
	var data = {
		_clientID: 100025126,
		_deExternalKey: '1D1F90A0-7505-4B96-BDC1-811A79683A2B',
		_action: 'add/update',
		_returnXML: 1,
		_successURL: location.href + '/#RegisterSuccess',
		_errorURL: location.href + '/#RegisterError',
		puuid: $('#email').val(),
		tft_website_signups: true,
		opt_in: true,
		'language preference': $("#inputLang").val(),
		'email address': $('#email').val(),
	}
	fetch('https://cl.s10.exct.net/DEManager.aspx', {
		method: 'post',
		'content-type': 'application/x-www-form-urlencoded',
		body: JSON.stringify(data),
		mode: 'no-cors',
	}).then(res => {
		console.log('请求结果:', res)
		return res.body
	}).then(data => {
		// closeDialog()
		TGDialogS("pop2")
	}).catch(err => {
		console.log('提交失败！', err)
		// closeDialog()
		TGDialogS("pop4")
	})
	return false
})


//新增点击分享按钮复制链接功能
copy('copyButton')
copy('copyButton2')
function copy(id) {
	const copyButton = document.getElementById(id);
	const textToCopy = window.location.href;
	copyButton.addEventListener('click', () => {
		navigator.clipboard.writeText(textToCopy)
			.then(() => {
				// alert('复制成功！');
				$(".copy_toast").show()
				$("#" + id).css("pointer-events", "none")
				setTimeout(function () {
					$(".copy_toast").fadeOut()
					$("#" + id).css("pointer-events", "auto")
				}, 1300)
			})
			.catch((error) => {
				// alert('复制失败：' + error);
				//	  TGDialogS("pop6")
			});
	});
}

$(".cookei_btn").on("click", function () {
	$(".osano-cm-widget").click()
})


///////////////////////  2期  //////////////////////////////
var qaNum = 1; //第几个题目
var resultNum = []; //结果图组合值
var resultNum2 = ""; //最后组合字符串
var resultLang = ""; //结果图多语言
//点击选择答案
$(".answer_list li").on("click", function () {
	//传入选择答案
	resultNum.push($(this).index())
	//防抖
	$(".answer_list li").css("pointer-events", "none")
	//添加选中样式
	$(".answer_list li").removeClass("cur")
	$(this).addClass("cur")
	if (qaNum < 3) {
		//显示下一道题
		qaNum++;
		setTimeout(function () {
			$(".qa_box").hide()
			$(".qa_box" + qaNum).show()
			//防抖
			$(".answer_list li").css("pointer-events", "auto")
		}, 200)
	} else {
		//显示结果图弹窗
		qaNum = 1;
		resultNum2 = resultNum.toString().split(",").join("")
		// console.log(resultNum2)
		setTimeout(function () {
			$(".answer_list li").removeClass("cur")
			$(".qa_box").hide()
			$(".qa_box1").show()
			//判断语言
			if (language == "ENPH") {
				resultLang = "en"
			}
			if (language == "ENMY") {
				resultLang = "en"
			}
			if (language == "TH") {
				resultLang = "th"
			}
			if (language == "TW") {
				resultLang = "tw"
			}
			if (language == "ID") {
				resultLang = "id"
			}
			//多语言分享图暂无 目前展示为英文
			$(".result_img").attr("src", "images/share/" + resultLang + "/" + resultNum2 + ".jpg")
			// $(".result_img").attr("src","images/share/en/"+resultNum2+".jpg")
			//弹出结果图
			TGDialogS('pop_result')
			//防抖
			$(".answer_list li").css("pointer-events", "auto")
		}, 200)
	}
})

$(".pop_result .pop_close2").on("click", function () {
	//重置数值
	resultNum = []; //结果图组合值
	resultNum2 = ""; //最后组合字符串
})


function popupWindow(url, title, w, h) {
	wLeft = window.screenLeft ? window.screenLeft : window.screenX;
	wTop = window.screenTop ? window.screenTop : window.screenY;

	var left = wLeft + (window.innerWidth / 2) - (w / 2);
	var top = wTop + (window.innerHeight / 2) - (h / 2);
	return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}

$('#faceBookShare').on('click', function () {
	var metaUrl = shareMetaUrl()
	console.log(metaUrl)
	popupWindow('https://www.facebook.com/sharer.php?u=' + encodeURIComponent(metaUrl), 'facebook', 800, 600)
})

$('#twitterShare').on('click', function () {
	var text = langObj2['lang30'];
	var metaUrl = shareMetaUrl()
	var shareUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(metaUrl);

	popupWindow(shareUrl, 'facebook', 800, 600)
})

function shareMetaUrl() {
	console.log(resultLang)
	console.log(resultNum2)
	return `${thisUrl.origin}/share/` + resultLang + `/` + resultNum2 + `.html?invitationCode=` + invitationCode
}

// var url = 'https://riot.7jing.com/php'
var url = `${thisUrl.origin}`
var invitationCode = $.trim(getQueryString('invitationCode'))
// pc跳入第二屏
if (invitationCode !== undefined && invitationCode != '' && !isMobile()) {
	$.fn.fullpage.moveTo(2)
}
var isLogin = false
$.ajax({
	url: url + '/api/init?invitationCode=' + invitationCode,
	type: 'GET',
	dataType: 'json',
	success: function (res) {
		if (res.iRet != 0) {
			// 不提示登录
			if (res.iRet == 40001) {
				return false;
			}
			showAlert(res.iRet)
			return false
		}

		isLogin = true
		var jData = res.jData
		invitationCode = jData.invitationCode
		var invitationCount = jData.invitationCount
		$('#friendsNum').text(invitationCount)
		var liHtml = '';
		for (var i = 1; i <= 3; i++) {
			if (i <= invitationCount) {
				liHtml += '<li><img src="images/two/tx' + i + '.jpg" alt=""></li>'
			} else {
				liHtml += '<li></li>'
			}
		}

		$('#friends_list').html(liHtml)
		if (invitationCount == 3) {
			$('#collectBtn').removeClass('gray')
		} else {
			$('#collectBtn').addClass('gray')
		}
	},
	error: function (res) {
	},
	complete: function () {
	}
});

// 点击答题
// var callbackUrl = 'https://www.7jing.com/riot/tftm/callback.php'
var callbackUrl = `${thisUrl.origin}/api/callback`
var loginUrl = 'https://auth.riotgames.com/authorize?redirect_uri=' + callbackUrl + '&client_id=e74006e7-ba31-4446-b0f2-3a29c66919cd&response_type=code&scope=openid';
console.log(callbackUrl)

var collectBtnClick = false
$('#collectBtn').on('click', function () {
	if (collectBtnClick) {
		return false;
	}

	if ($(this).hasClass('gray')) {
		return false;
	}

	var _this = $(this)
	if (!isLogin) {
		alertLogin()
		return false
	}

	collectBtnClick = true

	getReward(6)

})

$('.collectBtn').on('click', function () {
	let pos = $(this)[0].dataset.pos
	getReward(pos)
})
function getReward(pos) {
	$.ajax({
		// url: url + '/invitation/collect?invitationCode=' + invitationCode,
		url: url + '/api/collect?prizePosition=' + pos,
		type: 'GET',
		dataType: 'json',
		success: function (res) {
			collectBtnClick = false
			if (res.iRet != 0) {
				if (res.iRet == 40001) {
					alertLogin()
					return false;
				}
				showAlert(res.iRet)
				return false
			}
			TGDialogS('pop_ts1')
			_this.addClass('gray')
		},
		error: function (res) {
			collectBtnClick = false
		},
		complete: function () {
			collectBtnClick = false
		}
	})
}

function showAlert(iRet) {
	var text = getSMsgByiRet(iRet)
	$('#ts2P').text(text)
	TGDialogS('pop_ts2')
}

// 根据后端返回的错误码提示前端
function getSMsgByiRet(iRet) {
	var languageIdMap = {
		40001: 25,
		50001: 26,
		20001: 29,
		20002: 27,
		20003: 28
	}

	var languageId = languageIdMap[iRet]
	if (languageId === undefined) {
		languageId = 26
	}

	return langObj2['lang' + languageId]
}

function alertLogin() {
	showAlert(40001)
	window.location.href = loginUrl
}

$('.showTopic').on('click', function () {
	if (!isLogin) {
		alertLogin()
		return false
	}

	TGDialogS('pop_qa')
})