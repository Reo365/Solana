/**
 * element에 값이 있는지 리턴.
 */
Array.prototype.contains = function(element) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == element) {
			return true;
		}
	}
	return false;
};

/**
 * value를 찾아서 삭제
 */
Array.prototype.remove = function(value) {
	var index = this.findIndex(function(item) {
		return item === value
	});
	if (index > -1) {
		this.splice(index, 1);
	}
};

/**
 * 구글 통계 관련 유틸
 */
var GoogleAnalyticsUtils = {

	/**
	 * 로그인 정보를 구글에 보냄. (기존 중고딩 소스 활용)
	 */
	sendLoginInfo: function() {
		Ajax.execute({
			type: 'get',
			url: '/member/google.json',
			dataType: 'json',
			success: function(data) {
				var result = data.response;
				if (result != null) {
					var myGradeGaString = "";
					var myGrade = result.myGrade;
					if (myGrade != "") {
						var arrMyGrade = myGrade.split(",");
						for (var i = 0; i < arrMyGrade.length; i++) {
							myGradeGaString += "[" + arrMyGrade[i] + "]";
						}
					}
					gtag('set', {
						'user_properties': {
							'regDate': result.regDate,
							'sex': result.sex,
							'age': result.age,
							'fkareaname': result.fkareaname,
							'schName': result.schName,
							'mainSubject': result.mainSubject,
							'schoolLvlNm': result.schoolLvlNm,
							'myGradeGaString': myGradeGaString,
							'visangTbYN': result.visangTbYN,
							'mailingYn': result.mailingYn
						}
					});
				}
			},
		});
	}
};


var PopupSize = {
	// 음원 뷰어 vivasam_common.js) 와 동일한 값으로 세팅 되어야 함
	VIEWER_AUDIO: {
		width: 900,
		height: 830,
	},
	PROBLEM_DATA_MAIN: {
		width: 1200,
		height: 993,
	},
};

/**
 * 세션 관련 유틸 클래스
 */
var SessionUtils = {

	MESSAGE_LOGIN: '로그인이 필요한 서비스입니다.',

	/**
	 * 로그인 체크
	 * @param redirectURL
	 * @param msg
	 */
	isLogin: function(redirectURL, msg) {
		if (!msg) {
			msg = SessionUtils.MESSAGE_LOGIN;
		}
		if (!window.globals.login) {
			alert(msg);
			if (opener) {
				if (StringUtils.isNotEmpty(redirectURL)) {
					opener.location.href = '/member/login?goURL=' + encodeURIComponent(redirectURL);
				} else {
					opener.location.href = '/member/login';
				}
				self.close();
			} else {
				if (StringUtils.isNotEmpty(redirectURL)) {
					location.href = '/member/login?goURL=' + encodeURIComponent(redirectURL);
				} else {
					location.href = '/member/login';
				}
			}
			return false;
		}
		return true;
	},
	isAccessLevel: function(kind, url, contentId, contentGubun) {
		// 로그인 필수 체크
		if (!SessionUtils.isLogin(url)) {
			return false;
		}
		// 준회원 제한
		if (window.globals.memberMlevel == 'AU400') {
			if (kind == "eleEvalData") {
				// 평가자료 여부 체크
				var result = true;
				Ajax.execute({
					url: '/master/getContentMemLevelCheck.json',
					type: 'get',
					async: false,
					data: {
						contentId: contentId,
						contentGubun: contentGubun,
					},
					dataType: 'json',
					success: function(data) {
						var levelCheck = data.response;
						if (!levelCheck) {
							alert("준회원은 이용이 불가능합니다.\n비바샘으로 문의해 주세요. (1544-7714)");
							result = false;
						}
					}
				});

				return result;
			} else if (kind == "eleEvalDataAllDownNo") {
				alert("전체 다운로드 자료에 평가자료가 포함되어 있습니다.\n준회원은 이용이 불가능합니다.\n비바샘으로 문의해 주세요. (1544-7714)");
			} else {
				alert("준회원은 이용이 불가능합니다.\n비바샘으로 문의해 주세요. (1544-7714)");
			}
			return false;
		}
		return true;
	},
	// 교사 인증 여부
	isValidMember: function() {
		if (!window.globals.login) {
			return false;
		}
		return window.globals.memberValidYn == 'Y' && window.globals.memberValidExpiredYN == 'N';
	},
	// 교사 인증 여부 확인
	confirmValidMember: function(callback) {
		if (this.isValidMember()) {
			callback(true);
			return false;
		}
		if (confirm('교사 인증을 해 주세요. 지금 인증을 진행하시겠습니까?')) {
			location.href = '/member/memberReCertify';
		}
		callback(false);
	},
	// 로그인(레이어 팝업)
	isLoginLayerPop: function() {
		if(!window.globals.login){
			Layer.openLayerLogin(function() {
				if (opener) {
					opener.location.reload();
					self.close();
				} else {
					location.reload();
				}
			});
			return false;
		}
		return true;
	}
};

var StringUtils = {

	/**
	 * value 값이 null 또는 공백인지 boolean 리턴.
	 * @param value
	 */
	isEmpty: function(value) {
		return value == undefined || value == null || value.length == 0;
	},

	/**
	 * value 값이 null이 아니고 공백이 아닌지 boolean 리턴
	 * @param value
	 */
	isNotEmpty: function(value) {
		return value != undefined && value != null && value.length > 0;
	},

	/**
	 * value 값이 null 또는 공백이면 replace 반환
	 * @param value
	 * @param replace
	 */
	ifEmpty: function(value, replace) {
		return StringUtils.isEmpty(value) ? replace : value;
	},
};

var ArrayUtils = {

	/**
	 * values 값이 null이 아니고 공백이 아닌지 boolean 리턴
	 * @param values
	 */
	isEmpty: function(values) {
		return values == undefined && values == null && values.length == 0;
	},

	/**
	 * values 값이 null이 아니고 공백이 아닌지 boolean 리턴
	 * @param values
	 */
	isNotEmpty: function(values) {
		return values != undefined && values != null && values.length > 0;
	}

};

var NumberUtils = {

	/**
	 * value가 짝수인지 리턴
	 * @param value
	 */
	isEvenNumber: function(value) {
		return value % 2 == 0;
	},

	/**
	 * value가 홀수인지 리턴
	 * @param value
	 */
	isOddNumber: function(value) {
		return !this.isEvenNumber(value);
	},

	/**
	 * value에 숫자이외의 값은 제거한 후 리턴.
	 * @param value
	 */
	removeText: function(value) {
		return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
	}

};

// 포맷 유틸 클래스
var FormatUtils = {

	/**
	 * duration 초단위 값을 시분초로 변환하여 리턴.
	 * @param duration
	 */
	toHourMinSeconds: function(duration) {
		var hour = parseInt(duration / 3600);
		var min = parseInt((duration % 3600) / 60);
		var sec = Math.round(duration % 60);
		var time = '';
		if (hour > 0) {
			time += hour;
		}
		if (min > 0) {
			if (hour > 0) {
				time += ':';
			}
			time += min;
		}
		if (sec > 0) {
			if (time > 0) {
				time += ':';
			}
			time += sec;
		}
		return time;
	},

	/**
	 * duration 초단위 값을 분초로 변환하여 리턴.
	 * @param duration
	 */
	toMinSeconds: function(duration) {
		var min = parseInt((duration % 3600) / 60);
		var sec = Math.round(duration % 60);
		var time = '';
		if (min > 0) {
			if (min < 10) {
				time += '0';
			}
			time += min;
		} else {
			time += '00';
		}
		time += ':';
		if (sec > 0) {
			if (sec < 10) {
				time += '0';
			}
			time += sec;
		} else {
			time += '00';
		}
		return time;
	}
};

var RandomUtils = {
	guid: function() {
		function _s4() {
			return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
		}
		return _s4() + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + _s4() + _s4();
	},
};

// localstorge 유틸 클래스
var StorageUtils = {

	/**
	 * localstorage 사용가능여부 리턴
	 */
	available: function(type) {
		var storage;
		try {
			storage = window[type];
			var x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);
			return true;
		} catch (e) {
			return e instanceof DOMException && (
					// Firefox를 제외한 모든 브라우저
				e.code === 22 ||
				// Firefox
				e.code === 1014 ||
				// 코드가 존재하지 않을 수도 있기 떄문에 이름 필드도 확인합니다.
				// Firefox를 제외한 모든 브라우저
				e.name === 'QuotaExceededError' ||
				// Firefox
				e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
				// 이미 저장된 것이있는 경우에만 QuotaExceededError를 확인하십시오.
				(storage && storage.length !== 0);
		}
	},

	/**
	 * key에 value를 set 한다.
	 * @param key
	 * @param value
	 */
	setValue: function(key, value) {
		window.localStorage.setItem(key, value);
	},

	/**
	 * key에 오늘날짜를 value에 set 한다.
	 * @param key
	 * @param value
	 */
	setValueDate: function(key) {
		this.setValue(key, new Date().getDate());
	},

	/**
	 * key에 value를 리턴한다.
	 * @param key
	 */
	getValue: function(key) {
		return window.localStorage.getItem(key);
	},

	/**
	 * key에 value를 리턴한다. (boolean 으로 리턴)
	 * @param key
	 */
	getBoolean: function(key) {
		var value = this.getValue(key);
		if (typeof value == Boolean) {
			return value;
		}
		if (StringUtils.isNotEmpty(value) && (value == 'true' || value == 'false')) {
			return JSON.parse(value);
		}
		return false;
	},

	/**
	 * key에 value를 리턴한다. (boolean 으로 리턴)
	 * @param key
	 */
	isOpened: function(key) {
		var value = this.getValue(key);
		var isOpen = false;
		if (StringUtils.isEmpty(value)) {
			isOpen = true;
		} else {
			// 저장만 날짜와 일자가 다르다면 open
			isOpen = value != new Date().getDate();
		}
		return isOpen;
	},

	/**
	 * key에 value를 리턴한다. (boolean 으로 리턴)
	 * '다시 보지 않기' 기능 구현
	 * @param key
	 */
	isOpenedForever: function(key) {
		var value = this.getValue(key);
		var isOpen = false;
		if (StringUtils.isEmpty(value)) {
			isOpen = true;
		}
		return isOpen;
	},

	/**
	 * key에 value를 Array로 리턴한다.
	 * @param key
	 */
	getValues: function(key) {
		var values = this.getValue(key);
		// 없는경우는 배열로 선언
		if (StringUtils.isEmpty(values)) {
			values = [];
		} else {
			// array로 변환
			try {
				values = JSON.parse(values);
			} catch (e) {
				console.log(e);
				values = [];
			}
		}
		return values;
	},

	/**
	 * key에 value를 Array형태의 값으로 사용할 수 있게 저장한다.
	 * @param key
	 * @param value
	 * @param options
	 */
	addValue: function(key, value, options) {
		var values = this.getValues(key);
		var isAppend = true;
		// 중복필터
		if (options.filter) {
			if (values.contains(value)) {
				isAppend = false;
			}
		}
		if (isAppend) {
			// 갯수 제한
			if (options.limit && options.limit == values.length) {
				// 마지막 배열의 값을 제거한다.
				values.splice(values.length - 1, 1);
			}
			// 동일한 값이 없는 경우
			if (options.unshift) {
				values.push(value);
			} else {
				values.unshift(value);
			}
			// array값을 json 문자열로 변환하여 저장
			this.setValue(key, JSON.stringify(values));
		}
	},

	/**
	 * key에 value를 Array형태의 값으로 사용할 수 있게 저장한다. (항상 배열 첫번째에 추가)
	 * @param key
	 * @param value
	 */
	addValueUnShfit: function(key, value) {
		var values = this.getValues(key);
		// 동일한 값이 없는 경우
		if (!values.contains(value)) {
			values.unshift(value);
			// array값을 json 문자열로 변환하여 저장
			this.setValue(key, JSON.stringify(values));
		}
	},

	/**
	 * key에 저장된 값을 모두 삭제한다.
	 * @param key
	 */
	remove: function(key) {
		window.localStorage.removeItem(key);
	},

	/**
	 * key에 저장된 값중 index의 위치만 삭제한다.
	 * @param key
	 * @param index
	 */
	removeIndex: function(key, index) {
		var values = this.getValues(key);
		// index 위치 삭제
		values.splice(index, 1);
		// 다시 저장
		this.setValue(key, JSON.stringify(values));
	}
};

// 공통 레이아웃 핸들링 관련 클래스
var LayoutHandler = {

	STORAGE_TEXTBOOK_FIXED: 'STORAGE_TEXTBOOK_FIXED', // 상단 교과서 자료실 고정 키
	/**
	 * 서브메뉴를 가져옴
	 */
	loadSubmenu: function() {
		Ajax.execute({
			url: '/layout/submenu.html',
			data: {
			},
			dataType: 'html',
			loading: false,
			async: true,
			type: 'get',
			success: function(html) {
				$('.gnb .gnb_depth').html(html);
				LayoutHandler.handleTopmenu();
			}
		});
	},
	/**
	 * 이벤트 정보를 가져옴
	 */
	loadEventInfo: function() {
		Ajax.execute({
			url: '/layout/loadEvent.html',
			data: {
			},
			dataType: 'html',
			loading: false,
			async: true,
			type: 'get',
			success: function(html) {
				$("#eventInfo").empty;
				$("#eventInfo").append(html);
			}
		})
	},
	/**
	 * 이슈키워드를 가져옴
	 * 230126 개편으로 인한 기능 미사용
	 * 250208 개편으로 재사용
	 */
	loadIssueKeyword: function() {
		Ajax.execute({
			url: '/layout/keyword.html',
			data: {
			},
			dataType: 'html',
			loading: false,
			async: true,
			type: 'get',
			success: function(html) {
				$('#issueKeyword').html(html);
				$('#issueKeyword').rollingBanner(5000, false);
				// 검색어가 있는경우
				if ($('input[name=query]').val() && $('input[name=query]').val().length > 0) {
					$('#issueKeyword').hide();
				}
			}
		});
	},

	/*
	 * 탑 영역 핸들링
	 */
	handleTopmenu: function() {
		var $btnTextbookFixed = $('#btn-textbook-fixed');
		var $textbookDepth = $('#textbook-depth');

		// 교과서 자료실 우측 고정 버튼 클릭 이벤트
		$btnTextbookFixed.bind('click', function () {
			if (!$btnTextbookFixed.hasClass('on')) {
				$textbookDepth.stop().fadeIn();
				StorageUtils.setValue(LayoutHandler.STORAGE_TEXTBOOK_FIXED, true);
				$btnTextbookFixed.addClass('on');
				$textbookDepth.addClass('on');
			} else {
				$textbookDepth.stop().fadeOut();
				StorageUtils.setValue(LayoutHandler.STORAGE_TEXTBOOK_FIXED, false);
				$btnTextbookFixed.removeClass('on');
				$textbookDepth.removeClass('on');
			}
		});

		// 교과서 자료실 고정여부 체크
		var isTextbookFixed = StorageUtils.getBoolean(LayoutHandler.STORAGE_TEXTBOOK_FIXED);

		if (isTextbookFixed) {
			$btnTextbookFixed.addClass('on');
			$textbookDepth.addClass('on');
			$textbookDepth.stop().fadeIn();
		}

		// gnb 메뉴
		var $gnb = $('.gnb');
		var $gnbMenu = $('.gnb .gnb_depth');
		var GNB_DEPTH_SLIDE_DURATION = 300;
		// 상위 메뉴 마우스 클릭 이벤트
		var currentIndex = -1;

		$gnb.find('.gnbmenu li a').on('click', function () {
			var $a = $(this);
			var $li = $a.closest('li');
			var data = $li.data();
		});
		
		// // gnb 배너 랜덤 노출
		// var random = Math.floor(Math.random() * $('.headerBannerWrap .randomBanner').length);
		// $('.headerBannerWrap .randomBanner').hide().eq(random).show();
	},

	/**
	 * 좌측메뉴 핸들링
	 */
	handleSidemenu: function() {
		// 좌측메뉴 1차 메뉴가 2차메뉴가 있는경우 핸들링.
		$('.lnb li h5').click(function() {
			if ($(this).parent('li').hasClass('on')) {
				$(this).parent('li').removeClass('on');
			} else {
				// $('.lnb li').removeClass('on');
				$(this).parent('li').addClass('on');
			}
		});
	},

	/**
	 * 우측 퀵메뉴 핸들링
	 */
	handleQuickmenu: function(t) {
		if(!t) {
			return false;
		}
		var duration = 300;
		var durationtype02 = 100;
		var $quickMenu = $('#quickMenu');
		var $quickevt = $('.quickevt_banner'); //퀵메뉴 이벤트 배너
		var $quickBanner = $('.viversam_menu2.event'); //퀵메뉴 비버샘 홍보 배너
		var $header = $('.wrap .header');
		var $wrap = $('.wrap');
		const $btnTop = $('.gotop');
		// 퀵메뉴

		$(window).scroll(function() {
			var headerHeight = $header.outerHeight();
			if (!$header.is('.type02, .type03')) {
				if ($(this).scrollTop() > 135) {
					$header.addClass('fix');
					$wrap.find('.logo').prependTo($('.gnb article'));
					$wrap.css('paddingTop', '197px');
					$btnTop.removeClass('hide');
				} else if ($(this).scrollTop() < 135) {
					$header.removeClass('fix');
					$wrap.find('.logo').prependTo($('.top article'));
					$wrap.css('paddingTop', 0);
					$btnTop.addClass('hide');
				}
			}
		});

		$(window).resize(function() {
			if ($(window).width() > 1600) {
				$quickMenu.addClass('q_open').stop(true).animate({ right: '0px' }, duration, 'linear');
				$quickMenu.find('.pseudo').css("opacity", "0").css('z-index', 0).css('display', 'none');
				$quickMenu.find('.quick_menu_visual').css("opacity", "0").css('z-index', 0);
				$quickevt.animate({ right: '182px' }, 0, duration, 'linear');
				$quickBanner.addClass('on');
			} else if ($(window).width() <= 1600) {
				$quickMenu.removeClass('q_open').stop(true).animate({ right: '-100px' }, duration, 'linear');
				$quickMenu.find('.pseudo').css('z-index', 30).css('display', 'block').animate({ opacity: '1' }, durationtype02, 'linear');
				$quickMenu.find('.quick_menu_visual').css('z-index', 30).animate({ opacity: '1' }, durationtype02, 'linear');
				$quickevt.animate({ right: '60px' }, 0,  duration, 'linear');
				$quickBanner.removeClass('on');
			}
		})

		// 탑 버튼 클릭
		$('#btn-top').bind('click', function() {
			LayoutHandler.scrollTop();
		});

		// 퀵메뉴 숨겨진 상태에서 로그인 버튼 클릭 이벤트
		$quickMenu.find('a.btn-quick-login').click(function() {
			$quickMenu.find('.btn_side').trigger('click');
		});
		// 퀵메뉴 로그인 처리
		$quickMenu.find('a.btn_login').click(function() {

			if ($quickMenu.find('#quickUserId').val() == '') {
				alert('아이디를 입력해 주세요.');
				return false;
			}
			if ($quickMenu.find('#quickUserPwd').val() == '') {
				alert('비밀번호를 입력해 주세요.');
				return false;
			}

			LayoutHandler.quickLoginInPage();
		});

		$quickMenu.find("#quickUserId, #quickUserPwd").keypress(function(e) {
			if (e.keyCode == 13) {
				$quickMenu.find('a.btn_login').click();
				return false;
			}
		});

		// 퀵메뉴 닫기 처리
		$quickMenu.find('.btn_side').unbind().click();
		$quickMenu.find('.btn_side').click(function() {


			$quickMenu.toggleClass('q_open');
			// $quickMenu.find('.pseudo').animate({ opacity: '0' }, durationtype02, 'linear');
			// $quickMenu.find('.quick_menu_visual').animate({ opacity: '0' }, durationtype02, 'linear');

			if ($quickMenu.hasClass('q_open')) {
				localStorage.quickMenu ="open";
				$quickMenu.stop(true).animate({ right: '0px' }, 0, 'linear');
				$quickMenu.find('.pseudo').css("opacity", "0").css('z-index', 0).css('display', 'none');
				$quickMenu.find('.quick_menu_visual').css("opacity", "0").css('z-index', 0);
				//퀵메뉴 이벤트 배너
				// $quickevt.addClass('on');
				$quickevt.animate({ right: '182px' }, 0, 'linear');
				$quickBanner.addClass('on');
			} else {
				localStorage.quickMenu ="close";
				$quickMenu.stop(true).animate({ right: '-100px' }, 0, 'linear');
				$quickMenu.find('.pseudo').css('z-index', 30).css('display', 'block').animate({ opacity: '1' }, 0, 'linear');
				$quickMenu.find('.quick_menu_visual').css('z-index', 30).animate({ opacity: '1' }, 0, 'linear');
				//퀵메뉴 이벤트 배너
				// $quickevt.removeClass('on');
				$quickevt.animate({ right: '60px' }, 0, 'linear');
				$quickBanner.removeClass('on');
			};
		});


		$('.validPop .popClose').on('click', function(){
			$(this).parent('.validPop').hide();
		});

		//퀵메뉴 이벤트 배너 닫기
		$(".banner_close").click(function(){
			$quickevt.hide();
		}); 

		// 온리원 클릭
		$quickMenu.find('.btn-quickmenu-soobackc').bind('click', function(e) {
			if (!SessionUtils.isAccessLevel('soobakc', $(this).attr('href'))) {
				e.preventDefault();
				return false;
			}
			gtag('event', '온리원 추천강의', {
				'event_category' : '퀵메뉴',
				'event_label' : '온리원 추천강의',
				'value' : 1
			});


		});
		// 쿠키에 아이디 저장값 불러오기
		var cookieUserId = $.cookie('user_id');
		if (StringUtils.isNotEmpty(cookieUserId)) {
			$('#quickLoginFrm').find('input:text').val(cookieUserId);
			$('#quickIdSave').prop('checked', true);
		}
		// 처음에 강제로 scroll 이벤트 발생 퀵메뉴 디자인 깨지지 않게
		$(window).trigger('scroll');
	},
	quickLoginInPage: function() {

		var id = $.trim($('#quickLoginFrm').find('input:text').val());
		var pwd = $('#quickLoginFrm').find('input:password').val();

		if ($('#quickIdSave').is(':checked')) {
			$.cookie('user_id', id, { expires: 30, path: '/' });
		} else {
			$.cookie('user_id', '', { expires: 30, path: '/' });
		}

		$('#quickLoginFrm').find('input:text').val(id);
		$('#quickLoginFrm').find('input:password').val(pwd);

		Ajax.execute({
			url: '/member/signInVivasam.json',
			data: JSON.stringify({
				memberId: id,
				passwd: pwd,
				goUrl: window.location.href
			}),
			contentType: 'application/json',
			method: 'post',
			dataType: 'json',
			success: function(result) {
				if (result.response.code == null) {
					// 구글 로그인 통계 남김.
					GoogleAnalyticsUtils.sendLoginInfo();
				}
				var redirectURL = result.response.redirectURL;
				var msg = result.response.msg;

				if (StringUtils.isNotEmpty(redirectURL)) {
					// 메인페이지로 리다이렉트 인경우는 현재 보고 있는 페이지로 리로드 되게..
					if (redirectURL == '/main') {
						location.reload();
					} else {
						location.href = redirectURL;
					}
				}
				if (StringUtils.isNotEmpty(msg)) {
					if (result.response.retCheck == 'false') {
						if (result.response.retCheckCnt < 5) {
							if (result.response.retCheckCnt > 0) {
								$('#retLoginCnt').text(result.response.retCheckCnt);
								$("#pwd_dialog").show();
								$("#dialog1").show();
								$("#dialog2").hide();
							} else {
								$("#pwd_dialog").show();
								$("#dialog2").show();
								$("#dialog1").hide();
							}
						} else {
							alert(msg);
							location.href = "/member/login?goURL=" + location.pathname;
						}
					} else {
						alert(msg);
					}
				}
			}
		});
	},
	// 공통 체크 박스 핸들링
	checkbox: function() {
		$('.ui-checkbox-all-check-top').bind('click', function() {
			if ($(this).prop('checked')) {
				$('.ui-checkbox-all-check-top').prop('checked', true);
				$('.ui-checkbox-all-check-bottom').prop('checked', true);
				$('.ui-checkbox-all-check').prop('checked', true);
			} else {
				$('.ui-checkbox-all-check-top').prop('checked', false);
				$('.ui-checkbox-all-check-bottom').prop('checked', false);
				$('.ui-checkbox-all-check').prop('checked', false);
			}
		});
		// 하단 전체선택
		$('.ui-checkbox-all-check-bottom').bind('click', function() {
			if ($(this).prop('checked')) {
				$('.ui-checkbox-all-check-top').prop('checked', true);
				$('.ui-checkbox-all-check').prop('checked', true);
			} else {
				$('.ui-checkbox-all-check-top').prop('checked', false);
				$('.ui-checkbox-all-check').prop('checked', false);
			}
		});
	},

	scrollTop: function() {
		$('html, body').animate({
			scrollTop: 0
		}, 500);
	},

	//교과서 바로가기 selectbox생성기
	makeTextbookSelectBox: function() {
		if (typeof currentClassInfo === 'undefined') return; // 221124 hotfix songth- 교과서자료실 화면이 아닌데도 호출하는 경우 스크립트 오류로 인해 타입체크 함
		var bookname = currentClassInfo.textbookName;
		var regex = /[^0-9]/g;
		var result = bookname.replace(regex, "");
		var grade = result[0];
		var realTerm = '1';
		//var eduClsCode = $("input[name=eduClsCode]:checked").val();
		var eduClsCode = $("input[name=eduClsCode]").val();
		var term = $("input[name=semester]:checked").val();

		var params = {
			eduClsCode: eduClsCode,
			textbookCd: currentClassInfo.textbookCd,
			term: term,
			grade: grade
		}

		Ajax.execute({
			url: '/textbook/list/book/optionList',
			data: params,
			type: 'get',
			async: false,
			dataType: 'html',
			success: function (html) {
				$('#textbookSelect').empty();
				// 2023-02-20 주석처리
				// $('#textbookSelect').append("<option value='' disabled><a>" + grade + "-" + realTerm +" 교과서 바로가기</a></option>");
				$('#textbookSelect').append($(html));
			}
		});

	},
};
/**
 * 팝업 관련 클래스
 */
var Popup = {

	/**
	 * 브라우저 기본에서 지원되는 윈도우 팝업을 띄운다.
	 * @param options
	 */
	openWindow: function(options) {
		// 팝업사이즈가 넘어오는경우
		if (options.popupSize) {
			options.width = options.popupSize.width;
			options.height = options.popupSize.height;
		}
		var width = options.width ? options.width : 600;
		var height = options.height ? options.height : 400;
		var left = (screen.width - width) / 2;
		var top = (screen.height - height) / 2;
		var opener = null;

		if (options.fullscreen) {
			opener = window.open(options.url, options.name, 'width=' + screen.width + ', height=' + screen.height + ', menubar=no, status=no, toolbar=no, resizable=no, scrollbars=yes');
		} else {
			opener = window.open(options.url, options.name, 'left=' + left + ', top=' + top + ', width=' + width + ', height=' + height + ', menubar=no, status=no, toolbar=no, resizable=no, scrollbars=yes');
		}

		// 콜백 함수가 있는경우
		if (options.callback) {
			options.callback(opener);
		}

		try {
			// IE 버그로 timeout 줌
			setTimeout(function() {
				opener.focus();
				//opener.moveTo(0, 0);
				if (options.resize) {
					//opener.resizeTo(options.width, screen.height);
				}
			}, 100);
		} catch (e) {
			alert(e);
			alert('팝업이 차단되었습니다.\n브라우저 옵션에서 팝업 차단을 허용으로 바꿔주십시요.');
			console.log(e);
		}

		return opener;
	},

	/**
	 * 브라우저 기본에서 지원되는 윈도우 팝업을 띄운다.
	 * postType
	 * @param options
	 */
	openWindowPostType: function(options) {
		// 팝업사이즈가 넘어오는경우
		if (options.popupSize) {
			options.width = options.popupSize.width;
			options.height = options.popupSize.height;
		}
		var form = $('<form></form>');
		var width = options.width ? options.width : 600;
		var height = options.height ? options.height : 400;
		var left = (screen.width - width) / 2;
		var top = (screen.height - height) / 2;
		var opener = null;
		if (options.fullscreen) {
			opener = window.open("", options.name, 'width=' + screen.width + ', height=' + screen.height + ', menubar=no, status=no, toolbar=no, resizable=no, scrollbars=yes');
		} else {
			opener = window.open("", options.name, 'left=' + left + ', top=' + top + ', width=' + width + ', height=' + height + ', menubar=no, status=no, toolbar=no, resizable=no, scrollbars=yes');
		}

		form.attr('action', options.url);
		form.attr('target', options.name);
		form.attr('method', 'post');
		form.appendTo('body');

		// parameters에 배열형태로 input태그를 저장해야합니다.
		// ex) var parameter = [];
		// ex) parameter.push('<input type="text" name="***" value="***">');
		for(let i=0; i<options.parameters.length; i++) {
			form.append(options.parameters[i]);
		}
		form.submit();
		form.empty();
		form.remove();

		// 콜백 함수가 있는경우
		if (options.callback) {
			options.callback(opener);
		}

		try {
			// IE 버그로 timeout 줌
			setTimeout(function() {
				opener.focus();
				//opener.moveTo(0, 0);
				if (options.resize) {
					//opener.resizeTo(options.width, screen.height);
				}
			}, 100);
		} catch (e) {
			alert(e);
			alert('팝업이 차단되었습니다.\n브라우저 옵션에서 팝업 차단을 허용으로 바꿔주십시요.');
			console.log(e);
		}

		return opener;
	},

	/**
	 * 브라우저 기본에서 지원되는 새로운 탭을 띄운다.
	 * @param url
	 * @param name
	 */
	openWindowTab: function(url, name) {
		if (!name) {
			name = 'openWindowBlank';
		}
		var opener = window.open('', name);
		try {
			opener.location.href = url;
			opener.focus();
		} catch (e) {
			alert(e);
			alert('팝업이 차단되었습니다.\n브라우저 옵션에서 팝업 차단을 허용으로 바꿔주십시요.');
			console.log(e);
		}
	},

	/**
	 * 주소 검색 팝업화면
	 */
	openJuso: function() {
		this.openWindow({
			width: 535,
			height: 727,
			url: '/my/info/juso.popup',
			callback: function() {
			}
		});
	},

	openSamterJuso: function() {
		this.openWindow({
			width: 535,
			height: 727,
			url: '/samter/common/juso.popup',
			callback: function() {
			}
		});
	},

	/**
	 * FT359 iPDF 복합파일(ZIP) 뷰어를 오픈한다.
	 * @param contentId
	 */
	openSimpleSViewer: function(contentId) {
		var url = 'http://ebook.vivasam.com/v2/textbookviewer/simpleViewer.jsp?contentId=' + contentId;
		this.openWindowTab(url);
	},

	/**
	 * FT360	HTML5 (복합파일(ZIP) HTML5+ZIP (암석관) 이미지
	 * @param url
	 * @param eduClsCode
	 */
	openHtmlViewer: function(url,eduClsCode) {
		// eduClsCode 없을땐 기존처럼 cdn도메인으로 연결
		// 있으면 체크해서 dn22로 연결
		const domain = typeof eduClsCode === "undefined" ? window.globals.config.cdnDomain : eduClsCode.indexOf('22') > -1 ? window.globals.config.cdnDomain22 : window.globals.config.cdnDomain;
		var url = domain + url;

		this.openWindowTab(url);
	},

	/**
	 * TYPE가 Y일때 새창으로 띄워줌
	 * @param url
	 */
	openHtmlViewer2: function(url) {
		if (SessionUtils.isLogin()) {
			var url = url;
			this.openWindowTab(url);
		}
	},

	/**
	 * 파일 다운로드 Dext 라이브러리 팝업 화면을 띄운다.
	 * @param contentId 컨텐츠아이디
	 * @param downyn 다운로드 여부
	 * @param isNotSubmitGtag gtag 발송 방지 여부
	 */
	openFileDownloadDext: function(contentId, downyn, isNotSubmitGtag = false) {
		/*
		* IE11 버전, 호환성보기 체크 되어 있는 사용자에게는 alert 표시
		* 2021-09-27 김인수

		if(navigator.userAgent.indexOf("Trident/7.0") > -1 || (navigator.userAgent.indexOf('trident') > -1 && navigator.userAgent.indexOf('msie 7') > -1)) {
			alert("IE11 브라우저 또는 호환성 보기 설정을 통해서는 정상 다운로드가 안될 수 있습니다. \n" +
				"크롬이나 IE 엣지 이상의 브라우저를 통해 다운로드를 진행해 주세요.");
		}
 		*/

		//다운받을 수 없는 자료는 처음부터 종료
		if(downyn==='N'){
			return false;
		}

		/*
			2023-01-25 강남구
			다운로드 기능 변경 -> 팝업 -> 즉시 다운로드
		*/
		/*
		if($("a[class='down_atag']").length){
			$("a[class='down_atag']").remove();
		}
		*/
		//fileDownStart();
		fileNameList = [];
		filePathList = [];
		fileNameArr = [];
		filePathArr = [];
		downTimeArr = [];

		var downCompleteItems = [];
		var contentIds = contentId.split(",");

		for(var i=0; i<contentIds.length; i++) {
			var tContentId = contentIds[i];
			if(!tContentId){
				continue;
			}
			// 기존 아이디에서 아이디와 구분 값을 파싱
			var contentParam = tContentId.split('-');
			var _contentId = contentParam[1];
			var _contentGubun= contentParam[0];
			// 준회원 제한 기능 추가
			if (!SessionUtils.isAccessLevel('eleEvalData', location.href, _contentId, _contentGubun)) {
				return false;
			}

			SessionUtils.confirmValidMember(function(valid) {
				if (valid) {
					if (tContentId.indexOf('CN020') > -1) {
						alert('다운로드가 불가능한 컨텐츠 입니다.');
						return false;
					}
					// 새창인경우..
					if (opener) {
						// 로그인이 안된경우는 레이어로 띄우게..
						if (!window.globals.login) {
							Layer.openLayerLogin(function() {
								location.reload();
								opener.location.reload();
							});
							return false;
						}
					}
					if (SessionUtils.isLogin(location.href)) {
						// 공통 로직을 처리하기 위한 마스터 컨텐츠 조회
						Ajax.execute({
							url: '/master/content.json',
							type: 'get',
							data: {
								contentId: _contentId,
								contentGubun: _contentGubun,
							},
							dataType: 'json',
							async: false,
							success: function(data) {
								if (data.code == 'SUCCESS') {
									var masterContent = data.response;
									if (StringUtils.isNotEmpty(masterContent.siteUrl) && !masterContent.siteUrl.includes("vbook.vivasam.com")) {
										var extension = masterContent.siteUrl.substring(masterContent.saveFileName.lastIndexOf('.') + 1, masterContent.saveFileName.length);
										// 확장자가 html인경우는 새창으로
										if (extension == 'html') {
											Popup.openWindowTab(window.globals.config.cdnDomain + masterContent.siteUrl);
											return false;
										}
									}
									// if (downyn != 'N') {
									// 	alert('다운로드하시는 자료는 \'학교 및 교육기관의 수업\' 목적을 위해서만 한정하여 사용되도록 저작권법의 보호를 받고 있습니다. 수업 외의 목적으로 사용되지 않도록 주의 부탁드립니다.');
									// }
									// 현재창에서 다운로드
									// var html = "<iframe id='down_iframe' style='display:none;' src='/file/download/dext.popup?files=ID,"+tContentId+"&ufiles='></iframe>";
									// $("body").append(html);
									// 23.02.27 songth 변경 - 클라이언트 사이드 다운로드
									var a = document.createElement("a"); // a 태그 create

									//24.04.30 gangng 추가 - 22개정인 경우 cdn 도메인 변경
									var downloadUrlParameters = new URL(location.href).searchParams;
									var downloadEduClsCode = downloadUrlParameters.get('eduClsCode');
									if(downloadEduClsCode == "2022" || masterContent.eduClsCode == "2022"){
										a.href = window.globals.config.cdnDomain22 + masterContent.filePath + masterContent.saveFileName;
									}else{
										a.href = window.globals.config.cdnDomain + masterContent.filePath + masterContent.saveFileName;
									}

									a.download = masterContent.saveFileName;
									if (masterContent.fileType === 'FT210') {
										// 텍스트 파일 다운로드 시
										// 파일을 읽기 위한 FileReader 객체 생성
										var reader = new FileReader();
										// 파일이 로드될 때 실행되는 이벤트 핸들러
										reader.onload = function(event) {
											var contents = event.target.result;
											// 파일 내용을 사용하여 원하는 작업 수행
											var textToSaveAsBlob = new Blob([contents], {type:"text/plain"});
											a.href = window.URL.createObjectURL(textToSaveAsBlob);
											document.body.appendChild(a);
											a.click();
											sleep(300);
											document.body.removeChild(a);
										};
										// 파일을 읽어오기 위한 함수
										function readTextFile(file) {
											reader.readAsText(file, 'euc-kr');
										}

										// 파일을 가져오기 위한 XMLHttpRequest 객체 생성
										var xhr = new XMLHttpRequest();
										xhr.open("GET", a.href, true);
										xhr.responseType = "blob";
										var fileBlob = xhr.response;
										// 파일이 로드될 때 실행되는 이벤트 핸들러
										xhr.onload = function() {
											if (xhr.status === 200) {
												// 파일이 성공적으로 가져와진 경우
												var fileBlob = xhr.response;
												readTextFile(fileBlob);
											}
										};
										// 파일 가져오기 요청 보내기
										xhr.send();
									} else {
										if(masterContent.saveFileName.includes('xlsx')) {
											IeDownloadFile(a.href, a.download);
											sleep(300);
										} else {
											document.body.appendChild(a);
											a.click();
											sleep(300);
											document.body.removeChild(a);
										}
									}

									// 2023.08.31 songth 추가 - 다운로드 성공 시 포인트 지급을 위해 컨텐츠 임시저장
									var _tempCItem = {
										"contentId": _contentId,
										"contentGubun": _contentGubun
									}
									downCompleteItems.push(_tempCItem);

									if (!isNotSubmitGtag) {
										gtag('event', '다운로드', {
											'event_category': '자료다운로드',
											'event_label': masterContent.saveFileName,
											'send_to': 'G-HRYH9929GX'
										});
									}
								}
							}
						});
					}
				}
			});
		}

		// 2023.08.31 songth 추가 - 다운로드 성공 항목이 있으면 일괄 포인트 지급
		if (downCompleteItems.length > 0) {
			savePoint(downCompleteItems);
		}

		/*
		// 기본값이 true 일 경우
		if (contentCheck) {
			// 다운로드 갯수가 N개 일경우
			if (contentId.indexOf(',') > -1) {
				contentCheck = false;
			}
		}

		// 준회원 제한 기능 추가
		var contentParams = contentId.split(',');
		var levelCheck = true;
		for (var i = 0; i < contentParams.length; i++) {
			// 기존 아이디에서 아이디와 구분 값을 파싱
			var contentParam = contentParams[i].split('-');
			var _contentId = contentParam[1];
			var _contentGubun= contentParam[0];

			if (!SessionUtils.isAccessLevel('eleEvalData', location.href, _contentId, _contentGubun)) {
				levelCheck = false;
				break;
			}
		}
		if(!levelCheck) {
			return false;
		}

		SessionUtils.confirmValidMember(function(valid) {
			if (valid) {
				if (contentId.indexOf('CN020') > -1) {
					alert('다운로드가 불가능한 컨텐츠 입니다.');
					return false;
				}
				// 새창인경우..
				if (opener) {
					// 로그인이 안된경우는 레이어로 띄우게..
					if (!window.globals.login) {
						Layer.openLayerLogin(function() {
							location.reload();
							opener.location.reload();
						});
						return false;
					}
				}
				if (SessionUtils.isLogin(location.href)) {
					if (contentCheck) {
						// 공통 로직을 처리하기 위한 마스터 컨텐츠 조회
						Ajax.execute({
							url: '/master/content.json',
							type: 'get',
							data: {
								contentId: _contentId,
								contentGubun: _contentGubun,
							},
							dataType: 'json',
							success: function(data) {
								if (data.code == 'SUCCESS') {
									var masterContent = data.response;
									if (StringUtils.isNotEmpty(masterContent.siteUrl)) {
										var extension = masterContent.siteUrl.substring(masterContent.saveFileName.lastIndexOf('.') + 1, masterContent.saveFileName.length);
										// 확장자가 html인경우는 새창으로
										if (extension == 'html') {
											Popup.openWindowTab(window.globals.config.cdnDomain + masterContent.siteUrl);
											return false;
										}
									}
									// if (downyn != 'N') {
									// 	alert('다운로드하시는 자료는 \'학교 및 교육기관의 수업\' 목적을 위해서만 한정하여 사용되도록 저작권법의 보호를 받고 있습니다. 수업 외의 목적으로 사용되지 않도록 주의 부탁드립니다.');
									// }
									// 새창으로 다운로드 호출 (POST 방식 호출)
									Popup.openWindow({
										name: 'openFileDownloadDext',
										width: 800,
										height: 600,
										url: '',
										callback: function(opener) {

											var html = "";
										    html += "<html><head></head><body><form id='formid' method='post' action='/file/download/dext.popup'>";
										    html += "<input type='hidden' name='files' value='ID," + contentId + "'/>";
										    html += "<input type='hidden' name='ufiles' value=''/>";

										    html += "</form><script type='text/javascript'>document.getElementById(\"formid\").submit()</sc"+"ript></body></html>";

										    opener.document.write(html);

										}
									});

								}
							}
						});
					} else {
						// if (downyn != 'N') {
						// 	alert('다운로드하시는 자료는 \'학교 및 교육기관의 수업\' 목적을 위해서만 한정하여 사용되도록 저작권법의 보호를 받고 있습니다. 수업 외의 목적으로 사용되지 않도록 주의 부탁드립니다.');
						// }
						// 새창으로 다운로드 호출 (POST 방식 호출)
						Popup.openWindow({
							name: 'openFileDownloadDext',
							width: 800,
							height: 600,
							url: '',
							callback: function(opener) {

								var html = "";
							    html += "<html><head></head><body><form id='formid' method='post' action='/file/download/dext.popup'>";
							    html += "<input type='hidden' name='files' value='ID," + contentId + "'/>";
							    html += "<input type='hidden' name='ufiles' value=''/>";

							    html += "</form><script type='text/javascript'>document.getElementById(\"formid\").submit()</sc"+"ript></body></html>";

							    opener.document.write(html);

							}
						});
					}
				}
			}
		});
		*/
	},

	/**
	 * 듣기평가 파일 다운로드를 위해 중고등 팝업 연결
	 * @param contentId 컨텐츠아이디
	 * @param downyn 다운로드 여부
	 * @param contentCheck 컨텐츠 체크 여부
	 */
	openFileDownloadListen: function(ufile, nfile) {
		//var ufile = encodeURIComponent('http://vivatem.com/qpool/ITEM/AUDIO/2019/8/14/AUDIO_fe6dd054_3427_4205_817d_34887a11352f.mp3') + "|" + encodeURIComponent('http://vivatem.com/qpool/ITEM/AUDIO/2019/8/14/AUDIO_fe6dd054_3427_4205_817d_34887a11352f.mp3');
		//var nfile = "테스트 듣기평가 파일1" + "|" + "테스트 듣기평가 파일2";
		//Popup.openFileDownloadListen(ufile, nfile);

		// 준회원 제한 기능 추가
		/*if (!SessionUtils.isAccessLevel('eleEvalData', location.href)) {
			return false;
		}*/
		SessionUtils.confirmValidMember(function(valid) {
			if (valid) {
				// 새창인경우..
				if (opener) {
					// 로그인이 안된경우는 레이어로 띄우게..
					if (!window.globals.login) {
						Layer.openLayerLogin(function() {
							location.reload();
							opener.location.reload();
						});
						return false;
					}
				}
				if (SessionUtils.isLogin(location.href)) {
					//var url = "//" + "localhost:7070" + '/down/vivasamQbankdown.do';
					var url = "//" + globals.config.siteDomainMiddleHigh + '/down/vivasamQbankdown.do';

					var width   = 647;
					var height  = 450;
					var left    = (screen.width  - width)/2;
					var top    = (screen.height - height)/2;

					var newWindow = window.open('', "downloadwin", "left="+left+",top="+top+",width="+width+", height="+height+",scrollbars=no,toolbar=no,resizable=no,location=no");
					var html = "";
					html += "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><head><head></head><body>";
					html += "	<form id='formid' method='post' action='" + url +"'>";
					html += "		<input type='hidden' name='ufiles' value='" + ufile + "'/>";
					html += "		<input type='hidden' name='nfiles' value='" + nfile + "'/>";

					html += "	</form>";
					html += "	<script type='text/javascript'>document.getElementById(\"formid\").submit()</sc"+"ript>";
					html += "</body></html>";

					newWindow.document.write(html);
					return newWindow;


				}
			}
		});
	},

	/**
	 * 교과서 자료실 다운로드 스마트 DVD 팝업 화면을 띄운다.
	 * @param gradeTerm
	 */
	openTextbookDownloadDvd: function(gradeTerm) {
		// 새창으로 다운로드 호출
		var url = gradeTerm ? '/textbook/download/dvd.popup?gradeTerm=' + gradeTerm : '/textbook/download/dvd.popup';
		this.openWindow({
			name: 'openTextbookDownloadDvd',
			width: 1076,
			height: 760,
			url: url,
			callback: function() {
			}
		});
	},

	/**
	 * 통합뷰어를 오픈한다.
	 * @param contentId 컨텐츠아이디
	 * @param contentGubun 컨텐츠구분
	 * @param gubunCd L:대단원자료,C:공통자료,S:특화자료,T:유형별자료
	 * @param referMenu
	 */
	openViewerMain: function(contentId, contentGubun, gubunCd, referMenu, index) {
		// 준회원 제한 기능 추가
		if (!SessionUtils.isAccessLevel('eleEvalData', location.href, contentId, contentGubun)) {
			return false;
		}
		SessionUtils.confirmValidMember(function(valid) {
			if (valid) {
				Ajax.execute({
					url: '/viewer/check.json',
					type: 'get',
					data: {
						contentId: contentId,
						contentGubun: contentGubun,
					},
					dataType: 'json',
					success: function(data) {
						if (data.code == 'SUCCESS') {
							var masterContent = data.response;
							var viwerOptions = {
								name: 'openViewerMain_' + masterContent.fileType + (index || ""),
								url: '/viewer/main.popup?contentId=' + contentId + '&contentGubun=' + contentGubun + '&referMenu='
									+ (referMenu || (window.globals.menu || "")) + "&gubunCd=" + (gubunCd || ""),
								callback: function() {
								}
							};

							// cid 기준으로 뷰어 호출시 데이터 저장하는 Ajax 호출
							Ajax.execute({
								url: '/viewer/recentViewer',
								type: 'post',
								data: {
									contentId: contentId,
									contentGubun: contentGubun
								},
								success: function(response) {
									// console.log( response);
								},
								error: function(xhr, status, error) {
									console.error(error);
								}
							});

							// ZIP 컨텐츠는 새창으로 띄워주기
							if (masterContent.fileType == 'FT207') {
								// FT359	iPDF (복합파일(ZIP)
								if (masterContent.mediaKind == 'FT359') {
									Popup.openSimpleSViewer(masterContent.siteUrl);
									return false;
								}
								// FT360	HTML5 (복합파일(ZIP) HTML5+ZIP (암석관) 이미지
								else if (masterContent.mediaKind == 'FT360' || masterContent.siteUrl !== '') {
									if(masterContent.siteUrl == null){ // 해당 cid 의 siteUrl 이 null인 경우
										alert('본 자료는 파일이 함께 있어야 하는 압축(zip) 형태로 제공해 드리며, 미리보기는 제공되지 않습니다.');
										return false;
									}
									Popup.openHtmlViewer(masterContent.siteUrl,masterContent.eduClsCode);
									return false;
								}
								//학교자율시간 zip파일 이여도 얼럿 아닌 다운로드로
								else if (masterContent.educourseId == '2310041') {
									Popup.openFileDownloadDext('CN030-' + masterContent.contentId)
									return false;
								}
								// 일반 ZIP 자료는 미리보기 제공 안함
								else {
									alert('본 자료는 파일이 함께 있어야 하는 압축(zip) 형태로 제공해 드리며, 미리보기는 제공되지 않습니다.');
									return false;
								}
							} else {
								viwerOptions.fullscreen = true;
							}
							Popup.openWindow(viwerOptions);
						} else {
							alert(data.message);
						}
					}
				});
			}
		});
	},

	/**
	 * 통합뷰어(스타플레이어) 를 오픈한다.
	 * @param url 동영상 url
	 */
	openViewerStarplayer: function(url) {
		if (SessionUtils.isLogin(location.href)) {
			this.openWindow({
				name: 'openViewerStarplayer',
				width: 800,
				height: 600,
				url: '/viewer/starplayer.popup?url=' + encodeURI(url),
				callback: function() {
				}
			});
		}
	},

	/**
	 * 차시창 뷰어를 오픈한다.
	 * @param periodId 컨텐츠아이디
	 * @param textbookCd
	 * @param class1Cd
	 */
	openPeriodViewer: function(periodId, textbookCd, class1Cd, learningMap) {
		//배움지도에서 호출하지 않으면 모두 N
		if(learningMap == undefined) learningMap = "N";
		// lnbCode와 class1Cd는 동일한 값임. 교과자료실에서 lnbCode를 class1Cd로 변경함.
		this.openPeriodViewerUrl('/period/package.popup?periodId=' + periodId + '&textbookCd=' + textbookCd + '&lnbCode=' + class1Cd + "&learningMap=" + learningMap);
	},

	/**
	 * 차시창 뷰어를 오픈한다.
	 * @param url 컨텐츠아이디
	 * @param textbookCd
	 * @param class1Cd
	 */
	openPeriodViewerUrl: function(url) {
		if (SessionUtils.isLogin()) {
			SessionUtils.confirmValidMember(function(valid) {
				if (valid) {
					Popup.openWindow({
						name: 'openPeriodViewerUrl',
						url: url,
						fullscreen: true,
						callback: function() {
						}
					});
				}
			});
		}

	},

	/**
	 * 티칭뷰어를 오픈한다.
	 * @param educourseId
	 * @param content
	 */
	openTeachingNoteViewer: function(educourseId, content, memberId) {
		if (SessionUtils.isLogin()) {
			// 새창으로 다운로드 호출
			this.openWindow({
				name: 'openTeachingNoteViewer',
				width: 1000,
				height: 600,
				url: 'http://author.vivasam.com/author/lessonPlan/startTeachingNoteViewer.do?dataList=' + educourseId + '/' + content + '&userId=' + memberId,
				callback: function() {
				}
			});
		}
	},

	/**
	 * 지사안내 팝업을 오픈한다.
	 */
	openPublicBranch: function() {
		if (SessionUtils.isLogin()) {
			// 새창으로 다운로드 호출
			this.openWindow({
				name: 'openPublicBranch',
				width: 662,
				height: 610,
				url: '/public/branch',
				callback: function() {
				}
			});
		}
	}

};

/**
 * 레이어 관련 클래스
 */
var Layer = {

	/**
	 * css로 처리된 레이어팝업을 띄운다.
	 * @param options
	 */
	openLayer: function(options) {
		Ajax.execute({
			url: options.url,
			type: 'get',
			dataType: 'html',
			success: function(html) {
				// 기존 팝업 모두 제거
				Layer.clearLayer();
				var $div = $(html);
				// 팝업 닫기 버튼 이벤트
				$div.find('.popup_close').bind('click', function() {
					$div.remove();
					// 퀵메뉴 위치 재지정
					LayoutHandler.handleQuickmenu(1);
					// 닫기 콜백이 있는 경우
					if (options.callbackClose) {
						options.callbackClose();
					}
				});
				// 다른버전 팝업
				$div.find('.down_list_close').bind('click', function() {
					$div.remove();
					// 퀵메뉴 위치 재지정
					LayoutHandler.handleQuickmenu(1);
					// 닫기 콜백이 있는 경우
					if (options.callbackClose) {
						options.callbackClose();
					}
				});
				// 동적으로 가져온 팝업을 body에 추가해야 레이어가 노출된다.
				$('body').append($div);
				// 콜백
				if(options.callback) {
					options.callback($div);
				}
			}
		});
	},

	/**
	 * 기존 팝업 모두 제거
	 */
	clearLayer: function() {
		$('body').find('.layerPop').remove();
		$('body').find('.popup_wrap').not('[data-popup="false"]').remove();
		$('body').find('.pop_basic').remove();
		$('body').find('.dimmed:not(.fixed-dimmed)').remove();
	},

	/**
	 * 내 자료담기 화면 레이어 호출
	 * @param options
	 */
	openFolderMain: function(options) {
		// 준회원 제한 기능 추가
		var contentParams = options.parameter.code2.split(',');
		var levelCheck = true;
		for (var i = 0; i < contentParams.length; i++) {
			// 기존 아이디에서 아이디와 구분 값을 파싱
			var contentParam = contentParams[i].split('-');
			var _contentId = contentParam[1];
			var _contentGubun= contentParam[0];

			if (!SessionUtils.isAccessLevel('eleEvalData', location.href, _contentId, _contentGubun)) {
				levelCheck = false;
				break;
			}
		}
		if(!levelCheck) {
			return false;
		}
		var self = this;
		SessionUtils.confirmValidMember(function(valid) {
			if (valid) {
				var queryString = '';
				// 교과서 자료실 인경우
				if (options.type == 'TEXTBOOK') {
					queryString = 'code1=' + options.parameter.textbookCd;
				}
				var url = options.edit ? '/folder/edit.popup' : '/folder/main.popup' + '?' + queryString;
				Layer.openLayer({
					url: url,
					callback: function($div) {
						var $scrollbar = $div.find('.mCustomScrollbar');
						if($scrollbar) {
							$scrollbar.mCustomScrollbar();
						}
						// 수정에서는 확인 버튼이 필요없음
						if (options.edit) {
							$div.find('.popbuttons').hide();
						}

						// 폴더 추가 및 폴더 이름 변경시 해당 폴더 기본 선택 되도록..
						if (options.reOpenFolder) {
							if (options.addedFolderId) {
								$scrollbar.find('ul li input[value=' + options.addedFolderId + ']').attr('checked', true);
							} else {
								$scrollbar.find('ul li:nth(1) input').attr('checked', true);
							}
						}

						// 폴더 선택 이벤트
						$div.find('input[name=folderId]').bind('click', function() {
							$div.find('ul li').removeClass('active');
							$(this).closest('li').addClass('active');
						});
						// 폴더 추가하기 버튼 이벤트
						$div.find('.btn-folder-add').bind('click', function() {
							$div.find('ul li input').attr('checked', false);
							$div.find('.newList').show();
							$div.find('input[name=folderName]').val('');
							$div.find('input[name=folderName]').focus();
						});
						// 폴더 선택 이벤트
						$div.find('input[name=folderName]').bind('focus', function() {
							$div.find('ul li').removeClass('active');
							$(this).closest('li').addClass('active');
						});
						// 저장 이벤트
						$div.find('form').bind('submit', function() {
							if ($div.find('input[name=folderName]').val().length == 0) {
								alert('폴더명을 입력해주세요.');
								return false;
							}
							var data = {
								folderName: $div.find('input[name=folderName]').val()
							};
							// 수정인경우 수정을 선택한 폴더 아이디를 set
							if (options.edit) {
								data.folderId = $div.find('input[name=folderId]:checked').val()
								options.addedFolderId = data.folderId;
							}
							Ajax.execute({
								url: '/folder/save.json',
								data: data,
								method: 'post',
								success: function() {
									options.reOpenFolder = true;
									self.openFolderMain(options);
								}
							});
							return false;
						});
						// 확인 버튼 이벤트
						$div.find('.btn-confirm').bind('click', function() {
							if ($div.find('input[name=folderId]:checked').length == 0) {
								alert('내 자료 담기를 하실 폴더를 선택해주세요.');
								return false;
							}
							// 서버에 json 형태로 보내기 위해 데이터를 가공
							var contentParams = options.parameter.code2.split(',');
							var items = [];
							for (var i = 0; i < contentParams.length; i++) {
								var contentParam = contentParams[i].split('-');
								if (contentParam.length >= 2) {
									var item = {
										folderId: $div.find('input[name=folderId]:checked').val(),
										contentId: contentParam[1],
										contentGubun: contentParam[0],
										repeatRangeStart: 0,
										repeatRangeEnd: 0,
									};
									// 통합뷰어 동영상 구간반복 저장인경우...
									if (options.type == 'VIEWER_VIDEO_REPEAT') {
										item.repeatRangeStart = options.parameter.repeatRangeStart;
										item.repeatRangeEnd = options.parameter.repeatRangeEnd;
										item.repeatRangeTitle = options.parameter.repeatRangeTitle;
									}
									items.push(item);
								}
							}
							var data = {
								items: items,
								menu: options.menu,
								type: options.type
							};
							Ajax.execute({
								url: '/folder/content/save.json',
								data: JSON.stringify(data),
								contentType: 'application/json',
								method: 'post',
								success: function(response) {
									// 다시 재로딩
									// self.openFolderMain(options);
									$div.remove();
									// 콜백 함수가 있는경우
									if (options.callback) {
										options.callback(response);
									}
								}
							});
						});
						// 취소 버튼 이벤트
						$div.find('.btn-cancel').bind('click', function() {
							$div.find('.newList').hide();
							$div.find('.addList').show();
						});
						// 폴더 삭제 버튼 이벤트
						$div.find('.btn-folder-delete').bind('click', function() {
							if (!confirm('폴더의 모든 자료가 삭제됩니다.\n정말 삭제하시겠습니까?')) {
								return false;
							}
							$(this).closest('li').find('input[name=folderId]').prop('checked', true);
							Ajax.execute({
								url: '/folder/delete.json',
								data: {
									folderId: $(this).closest('li').find('input[name=folderId]').val()
								},
								method: 'post',
								success: function(response) {
									options.reOpenFolder = false; // 폴더 추가, 폴더 이름 변경 일 때만 사용
									// 다시 재로딩
									self.openFolderMain(options);
									// 콜백 함수가 있는경우
									if (options.callback) {
										options.callback(response);
									}
								}
							});
						});
						// 폴더 변경 버튼 이벤트
						$div.find('.btn-folder-edit').bind('click', function() {
							$(this).closest('li').find('input[name=folderId]').prop('checked', true);
							var data = $(this).data();
							// 기존 폴더명 set
							$div.find('input[name=folderName]').val(data.folderName);
							// 수정화면 보여주기
							$div.find('.newList').show();
							if($scrollbar) {
								$scrollbar.mCustomScrollbar('scrollTo', 'bottom', {
									scrollInertia: 500
								});
							}
						});
					}
				});
			}
		});
	},

	/**
	 * 로그인 팝업
	 * @param callback
	 */
	openLayerLogin: function(callback) {
		this.openLayer({
			url: '/member/layerLogin.popup',
			callback: function() {
				var winH = $(window).height(); //브라우저 높이

				var popW = $('#layerLogin').outerWidth();
				var popH = $('#layerLogin').outerHeight();

				var mgW = popW / 2;
				var posY = (winH - popH) / 2;
				var scrY = $(window).scrollTop(); //스크롤 위치

				$('#layerLogin').css({
					'display': 'block',
					'margin-left': -mgW + 'px',
					'top': (scrY + posY) + 'px',
					'left': '50%',
					'position': 'absolute'
				});

				$('.dimmed').show();

				if ($.trim(($.cookie('user_id') != 'null' && $.cookie('user_id') != 'undefined' ? $.cookie('user_id') : '')) != '') {
					$('#layerLoginFrm').find('input:text').val(($.cookie('user_id') != 'null' && $.cookie('user_id') != 'undefined' ? $.cookie('user_id') : ''));
					$('#layerIdSave').attr('checked', 'checked');
				}

				// 팝업 닫기 버튼 이벤트
				$('#layerLogin').find('.popup_close').on('click', function() {
					$('.dimmed').hide();
					$('#layerLogin').hide();
				});

				// 팝업 로그인 처리
				$('#layerLogin').find('a.btn_login').click(function() {
					if (!$('#layerLoginFrm').valid()) {
					} else {
						_layerLoginInPage();
					}
				});
				$('#layerLogin').find("#layerUserId, #layerUserPwd").keypress(function(e) {
					if (e.keyCode == 13) {
						$('#layerLogin').find('a.btn_login').click();
						return false;
					}
				});
				$('#layerLoginFrm').validate({
					rules: {
						userId: {
							required: true,
							minlength: 4
						},
						userPwd: {
							required: true
						}
					},
					messages: {
						userId: {
							required: "아이디를 입력해 주세요.",
							minlength: "아이디를 입력해 주세요."
						},
						userPwd: {
							required: "비밀번호를 입력해 주세요."
						}
					},
					errorPlacement: function(error, element) {
						if (element.attr("name") == "userId") {
							$("#layerLoginMsg").html(error.insertBefore(element));
							$("#layerLoginFrm #userPopId").focus();
							idFlag = true;
						} else {
							if (idFlag) {
								$("#layerLoginMsg").append("<br/>");
								$("#layerLoginMsg").append(error.insertBefore(element));
								$("#layerUserId").focus();
							} else {
								$("#layerLoginMsg").html(error.insertBefore(element));
								$("#layerUserPwd").focus();
							}
						}
					}
				});

				function _layerLoginInPage() {

					var id = $.trim($('#layerLoginFrm').find('input:text').val());
					var pwd = $('#layerLoginFrm').find('input:password').val();

					if ($('#layerIdSave').is(':checked')) {
						$.cookie('user_id', id, { expires: 30, path: '/' });
					} else {
						$.removeCookie("user_id");
					}

					$('#layerLoginFrm').find('input:text').val(id);
					$('#layerLoginFrm').find('input:password').val(pwd);

					Ajax.execute({
						url: '/member/signInVivasam.json',
						data: JSON.stringify({
							memberId: id,
							passwd: pwd
						}),
						contentType: 'application/json',
						method: 'post',
						dataType: 'json',
						success: function(result) {
							if (result.response.code == null) {
								// 구글 로그인 통계 남김.
								GoogleAnalyticsUtils.sendLoginInfo();
							}
							var redirectURL = result.response.redirectURL;
							var msg = result.response.msg;
							if (StringUtils.isNotEmpty(redirectURL)) {
								// 레이어 제거..
								Layer.clearLayer();

								if (callback) {
									callback(result);
								}
							}
							if (StringUtils.isNotEmpty(msg)) {
								alert(msg);
							}
						}
					});
				}
			}
		});
	},

	/**
	 * 공통 Url 로그인 팝업
	 * @param callback
	 * https://www.vivasam.com/ 에서 로그인이 필요한 경우 사용
	 */
	openLayerLoginCommonUrl: function(callback) {
		this.openLayer({
			url: '/member/common/url/layerLogin.popup',
			callback: function() {
				var winH = $(window).height(); //브라우저 높이

				var popW = $('#layerLogin').outerWidth();
				var popH = $('#layerLogin').outerHeight();

				var mgW = popW / 2;
				var posY = (winH - popH) / 2;
				var scrY = $(window).scrollTop(); //스크롤 위치

				$('#layerLogin').css({
					'display': 'block',
					'margin-left': -mgW + 'px',
					'top': (scrY + posY) + 'px',
					'left': '50%',
					'position': 'absolute'
				});

				$('.dimmed').show();

				if ($.trim(($.cookie('user_id') != 'null' && $.cookie('user_id') != 'undefined' ? $.cookie('user_id') : '')) != '') {
					$('#layerLoginFrm').find('input:text').val(($.cookie('user_id') != 'null' && $.cookie('user_id') != 'undefined' ? $.cookie('user_id') : ''));
					$('#layerIdSave').attr('checked', 'checked');
				}

				// 팝업 닫기 버튼 이벤트
				$('#layerLogin').find('.popup_close').on('click', function() {
					$('.dimmed').hide();
					$('#layerLogin').hide();
				});

				// 팝업 로그인 처리
				$('#layerLogin').find('a.btn_login').click(function() {
					if (!$('#layerLoginFrm').valid()) {
					} else {
						_layerLoginInPage();
					}
				});
				$('#layerLogin').find("#layerUserId, #layerUserPwd").keypress(function(e) {
					if (e.keyCode == 13) {
						$('#layerLogin').find('a.btn_login').click();
						return false;
					}
				});
				$('#layerLoginFrm').validate({
					rules: {
						userId: {
							required: true,
							minlength: 4
						},
						userPwd: {
							required: true
						}
					},
					messages: {
						userId: {
							required: "아이디를 입력해 주세요.",
							minlength: "아이디를 입력해 주세요."
						},
						userPwd: {
							required: "비밀번호를 입력해 주세요."
						}
					},
					errorPlacement: function(error, element) {
						if (element.attr("name") == "userId") {
							$("#layerLoginMsg").html(error.insertBefore(element));
							$("#layerLoginFrm #userPopId").focus();
							idFlag = true;
						} else {
							if (idFlag) {
								$("#layerLoginMsg").append("<br/>");
								$("#layerLoginMsg").append(error.insertBefore(element));
								$("#layerUserId").focus();
							} else {
								$("#layerLoginMsg").html(error.insertBefore(element));
								$("#layerUserPwd").focus();
							}
						}
					}
				});

				function _layerLoginInPage() {

					var id = $.trim($('#layerLoginFrm').find('input:text').val());
					var pwd = $('#layerLoginFrm').find('input:password').val();

					if ($('#layerIdSave').is(':checked')) {
						$.cookie('user_id', id, { expires: 30, path: '/' });
					} else {
						$.removeCookie("user_id");
					}

					$('#layerLoginFrm').find('input:text').val(id);
					$('#layerLoginFrm').find('input:password').val(pwd);

					Ajax.execute({
						url: '/member/signInVivasam.json',
						data: JSON.stringify({
							memberId: id,
							passwd: pwd
						}),
						contentType: 'application/json',
						method: 'post',
						dataType: 'json',
						success: function(result) {
							if (result.response.code == null) {
								// 구글 로그인 통계 남김.
								GoogleAnalyticsUtils.sendLoginInfo();
							}
							var redirectURL = result.response.redirectURL;
							var msg = result.response.msg;
							if (StringUtils.isNotEmpty(redirectURL)) {
								// 레이어 제거..
								Layer.clearLayer();

								if (callback) {
									callback(result);
								}
							}
							if (StringUtils.isNotEmpty(msg)) {
								alert(msg);
							}
						}
					});
				}
			}
		});
	},
	/**
	 * 학교 검색 팝업
	 */
	openLayerSchoolSearch: function(callback, callbackClose) {
		console.log(callback);
		Layer.openLayer({
			callbackClose : callbackClose,
			url: '/school/search.popup',
			callback: function($div) {
				var $searchForm = $div.find('form');
				// 학교 검색
				$searchForm.bind('submit', function() {
					if ($searchForm.find('input[name=name]').val().length < 2) {
						alert('소속명을 입력해 주세요');
						$searchForm.find('input[name=name]').focus();
						return false;
					}
					Ajax.execute({
						data: $searchForm.serialize(),
						dataType: 'html',
						type: 'get',
						url: "/school/search/list.html",
						success: function(html) {
							$div.find('.school_list ul').html(html);
						}
					});
					return false;
				});
				// 학교급 선택 이벤트
				$searchForm.find('input[name=tab]').bind('change', function() {
					if ($searchForm.find('input[name=name]').val().length > 1) {
						$searchForm.submit();
					}
				});
				// 시/도 콤보박스 클릭 이벤트
				$div.find('select[name=fkcode]').bind('change', function() {
					if ($(this).val().length == 0) {
						$div.find('select[name=pkcode]').find('option.data').remove();
					} else {
						Ajax.execute({
							data: {
								fkcode: $(this).val()
							},
							url: "/school/area/list.json",
							success: function(data) {
								$div.find('select[name=pkcode]').find('option.data').remove();
								var items = data.response;
								for (var i = 0; i < items.length; i++) {
									var item = items[i];
									$div.find('select[name=pkcode]').append($('<option class="data" value="' + item.pkcode + '">' + item.codename + '</option>'));
								}
							}
						});
					}
					if ($searchForm.find('input[name=name]').val().length > 1) {
						$searchForm.submit();
					}
				});
				// 구/군 콤보박스 클릭 이벤트
				$div.find('select[name=pkcode]').bind('change', function() {
					if ($searchForm.find('input[name=name]').val().length > 1) {
						$searchForm.submit();
					}
				});
				// 학교 선택 시 이벤트
				$div.on('click', '.btn-info-selected', function() {
					var data = $(this).closest('li').data();
					$('#sch_code_searchedv').val(data.code);
					$('#fkareacode').val(data.fkcode);
					$('#fkbranchcode').val(data.pkcode);
					$("#sch_kind_sel_1").val(data.tab);
					$('#sch_name_searchedv').val(data.name);
					$('#schoolFindPop').remove();
					$("input[name=myGrade]").prop("checked", false);
					if (data.tab == "E") {
						$("#schFlagHiddenId").show();
					} else {
						$("#schFlagHiddenId").hide();
					}

					if (callback) {
						console.log(data);
						callback(data);
					}
				});
				//찾으시는 학교가 없는경우 클릭 이벤트
				$div.find('.btnNoSearch').on('click', function() {
					Layer.openLayerRegistration(callback);
				});
				// 학교 추가 이벤트
				$div.on('click', '.btn-school-reg', function() {
					Layer.openLayerRegistration(callback);
				});
				var winH = $(window).height(); //브라우저 높이
				var popW = $('#schoolFindPop').outerWidth();
				var popH = $('#schoolFindPop').outerHeight();
				var mgW = popW / 2;
				var posY = (winH - popH);
				var scrY = $(window).scrollTop(); //스크롤 위치
				$('#schoolFindPop').css({
					'display': 'block',
					'margin-left': -mgW + 'px',
					'top': (scrY + posY + 80) + 'px',
					'left': '50%',
					'position': 'absolute'
				});
			}
		});
	},

	/**
	 * 이벤트 신청시 학교 등록 요청 없이 학교검색기능만 있는 팝업호출
	 * @param callback
	 */
	openLayerSchoolSearchForEvent: function(callback) {
		Layer.openLayer({
			url: '/school/search.popup',
			callback: function($div) {
				var $searchForm = $div.find('form');
				// 학교 검색
				$searchForm.bind('submit', function() {
					if ($searchForm.find('input[name=name]').val().length < 2) {
						alert('소속명을 입력해 주세요');
						$searchForm.find('input[name=name]').focus();
						return false;
					}
					Ajax.execute({
						data: $searchForm.serialize(),
						dataType: 'html',
						type: 'get',
						url: "/school/search/list.html",
						success: function(html) {
							$div.find('.school_list ul').html(html);

							// 학교 등록 링크 삭제
							$div.find('.btnNoSearch').remove();
						}
					});
					return false;
				});
				// 학교급 선택 이벤트
				$searchForm.find('input[name=tab]').bind('change', function() {
					if ($searchForm.find('input[name=name]').val().length > 1) {
						$searchForm.submit();
					}
				});
				// 시/도 콤보박스 클릭 이벤트
				$div.find('select[name=fkcode]').bind('change', function() {
					if ($(this).val().length == 0) {
						$div.find('select[name=pkcode]').find('option.data').remove();
					} else {
						Ajax.execute({
							data: {
								fkcode: $(this).val()
							},
							url: "/school/area/list.json",
							success: function(data) {
								$div.find('select[name=pkcode]').find('option.data').remove();
								var items = data.response;
								for (var i = 0; i < items.length; i++) {
									var item = items[i];
									$div.find('select[name=pkcode]').append($('<option class="data" value="' + item.pkcode + '">' + item.codename + '</option>'));
								}
							}
						});
					}
					if ($searchForm.find('input[name=name]').val().length > 1) {
						$searchForm.submit();
					}
				});
				// 구/군 콤보박스 클릭 이벤트
				$div.find('select[name=pkcode]').bind('change', function() {
					if ($searchForm.find('input[name=name]').val().length > 1) {
						$searchForm.submit();
					}
				});
				// 학교 선택 시 이벤트
				$div.on('click', '.btn-info-selected', function() {
					var data = $(this).closest('li').data();
					$('#sch_code_searchedv').val(data.code);
					$('#fkareacode').val(data.fkcode);
					$('#fkbranchcode').val(data.pkcode);
					$("#sch_kind_sel_1").val(data.tab);
					$('#sch_name_searchedv').val(data.name);
					$('#schoolFindPop').remove();
					$("input[name=myGrade]").prop("checked", false);
					if (data.tab == "E") {
						$("#schFlagHiddenId").show();
					} else {
						$("#schFlagHiddenId").hide();
					}
					if (callback) {
						callback(data);
					}
				});

				var winH = $(window).height(); //브라우저 높이
				var popW = $('#schoolFindPop').outerWidth();
				var popH = $('#schoolFindPop').outerHeight();
				var mgW = popW / 2;
				var posY = (winH - popH);
				var scrY = $(window).scrollTop(); //스크롤 위치
				$('#schoolFindPop').css({
					'display': 'block',
					'margin-left': -mgW + 'px',
					'top': (scrY + posY) + 'px',
					'left': '50%',
					'position': 'absolute'
				});
			}
		});
	},

	/**
	 * 초중고학교(만) 검색 팝업호출
	 * @param callback
	 */
	openLayerSchoolSearchForEventOnlyEMH: function(callback) {
		Layer.openLayer({
			url: '/school/searchOnlyEMH.popup',
			callback: function($div) {
				var $searchForm = $div.find('form');
				// 학교 검색
				$searchForm.bind('submit', function() {
					if ($searchForm.find('input[name=name]').val().length < 2) {
						alert('학교명을 입력해 주세요');
						$searchForm.find('input[name=name]').focus();
						return false;
					}
					Ajax.execute({
						data: $searchForm.serialize(),
						dataType: 'html',
						type: 'get',
						url: "/school/search/listOnlyEMH.html",
						success: function(html) {
							$div.find('.school_list ul').html(html);

							// 학교 등록 링크 삭제
							$div.find('.btnNoSearch').remove();
						}
					});
					return false;
				});
				// 학교급 선택 이벤트
				$searchForm.find('input[name=tab]').bind('change', function() {
					if ($searchForm.find('input[name=name]').val().length > 1) {
						$searchForm.submit();
					}
				});
				// 시/도 콤보박스 클릭 이벤트
				$div.find('select[name=fkcode]').bind('change', function() {
					if ($(this).val().length == 0) {
						$div.find('select[name=pkcode]').find('option.data').remove();
					} else {
						Ajax.execute({
							data: {
								fkcode: $(this).val()
							},
							url: "/school/area/list.json",
							success: function(data) {
								$div.find('select[name=pkcode]').find('option.data').remove();
								var items = data.response;
								for (var i = 0; i < items.length; i++) {
									var item = items[i];
									$div.find('select[name=pkcode]').append($('<option class="data" value="' + item.pkcode + '">' + item.codename + '</option>'));
								}
							}
						});
					}
					if ($searchForm.find('input[name=name]').val().length > 1) {
						$searchForm.submit();
					}
				});
				// 구/군 콤보박스 클릭 이벤트
				$div.find('select[name=pkcode]').bind('change', function() {
					if ($searchForm.find('input[name=name]').val().length > 1) {
						$searchForm.submit();
					}
				});
				// 학교 선택 시 이벤트
				$div.on('click', '.btn-info-selected', function() {
					var data = $(this).closest('li').data();
					$('#sch_code_searchedv').val(data.code);
					$('#fkareacode').val(data.fkcode);
					$('#fkbranchcode').val(data.pkcode);
					$("#sch_kind_sel_1").val(data.tab);
					$('#sch_name_searchedv').val(data.name);
					$('#schoolFindPop').remove();
					$("input[name=myGrade]").prop("checked", false);
					if (data.tab == "E") {
						$("#schFlagHiddenId").show();
					} else {
						$("#schFlagHiddenId").hide();
					}
					if (callback) {
						callback(data);
					}
				});

				var winH = $(window).height(); //브라우저 높이
				var popW = $('#schoolFindPop').outerWidth();
				var popH = $('#schoolFindPop').outerHeight();
				var mgW = popW / 2;
				var posY = (winH - popH);
				var scrY = $(window).scrollTop(); //스크롤 위치
				$('#schoolFindPop').css({
					'display': 'block',
					'margin-left': -mgW + 'px',
					'top': (scrY + posY) + 'px',
					'left': '50%',
					'position': 'absolute'
				});
			}
		});
	},


	/**
	 * 학교 추가 레이어
	 */
	openLayerRegistration: function(callback) {
		Layer.openLayer({
			url: '/school/form.popup',
			callback: function($div) {
				var $form = $div.find('form');
				// 학교 검색으로 돌아가기
				$div.find('.btn-ret-search').bind('click', function() {
					$('#schoolReg').remove();
					Layer.openLayerSchoolSearch(callback);
				});
				// 시/도 콤보박스 클릭 이벤트
				$form.find('select[name=fkcode]').bind('change', function() {
					Ajax.execute({
						data: {
							fkcode: $(this).val()
						},
						dataType: 'json',
						url: "/school/area/list.json",
						success: function(data) {
							$form.find('select[name=pkcode]').find('option.data').remove();
							var items = data.response;
							for (var i = 0; i < items.length; i++) {
								var item = items[i];
								$form.find('select[name=pkcode]').append($('<option class="data" value="' + item.pkcode + '">' + item.codename + '</option>'));
							}
						}
					});
				});
				// 학교 등록 신청하기
				$form.bind('submit', function() {
					Ajax.execute({
						data: $form.serialize(),
						dataType: 'json',
						url: "/school/save.json",
						success: function() {
							//학교 변경 여부
							$("#sch_kind_directley").val("1");
							var tab = $form.find('input[name=tab]:checked').val();
							if (tab == "MS") {
								$("#sch_code_searchedv").val("99998");
								$("#sch_kind_sel_1").val("M");
							} else if (tab == "HS") {
								$("#sch_code_searchedv").val("99999");
								$("#sch_kind_sel_1").val("H");
							} else if (tab == "C") {
								$("#sch_code_searchedv").val("99992");
								$("#sch_kind_sel_1").val("C");
							} else if (tab == "O") {
								$("#sch_code_searchedv").val("99993");
								$("#sch_kind_sel_1").val("O");
							} else if (tab == "K") {
								$("#sch_code_searchedv").val("99991");
								$("#sch_kind_sel_1").val("K");
							} else {
								$("#sch_code_searchedv").val("99997");
								$("#sch_kind_sel_1").val("E");
							}
							$("#sch_name_searchedv").val($form.find('input[name=name]').val());
							$("#fkareacode").val($form.find('select[name=fkcode]').val());
							$("#fkbranchcode").val($form.find('select[name=pkcode]').val());
							$("input[name=myGrade]").prop("checked", false);
							if (tab == "ES") {
								$("#schFlagHiddenId").show();
							} else {
								$("#schFlagHiddenId").hide();
							}
							//$('#requestedText').val($form.find('input[name=requestedText]').val());
							//console.log($form.find('textarea[name=requestedText]').val())
							$('#requestedText').val($form.find('textarea[name=requestedText]').val());
							$('#schoolArea1Text').val($form.find('select[name=fkcode] option:checked').text());
							$('#schoolArea2Text').val($form.find('select[name=pkcode] option:checked').text());
							$('#schoolReg').remove();
							var data = {
								tab : tab
								,sch_name_searchedv : $form.find('input[name=name]').val()
								,sch_code_searchedv : $("#sch_code_searchedv").val()
								,sch_kind_sel_1 :     $("#sch_kind_sel_1").val()
								,requestedText : $form.find('textarea[name=requestedText]').val()
								,schoolArea1Text : $form.find('select[name=fkcode] option:checked').text()
								,schoolArea2Text :$form.find('select[name=pkcode] option:checked').text()
								,fkareacode : $form.find('select[name=fkcode]').val()
								,fkbranchcode : $form.find('select[name=pkcode]').val()
								,newSchool : true

							}
							if (callback) {
								callback(data);
							}
						}
					});
					return false;
				});
				$('#schoolReg').show();
				$('#schoolFindPop').remove();
				var winH = $(window).height(); //브라우저 높이
				var popW = $('#schoolReg').outerWidth();
				var popH = $('#schoolReg').outerHeight();
				var mgW = popW / 2;
				var posY = (winH - popH);
				var scrY = $(window).scrollTop(); //스크롤 위치
				$('#schoolReg').css({
					'display': 'block',
					'margin-left': -mgW + 'px',
					'top': (scrY + posY) + 'px',
					'left': '50%',
					'position': 'absolute'
				});
			}
		});
	}

};

// 페이지네이션 관련 핸들러
var PaginationHandler = {

	/**
	 * 렌더 역활을 수행
	 */
	render: function(options) {
		// 전역에서 페이징 클릭시 a 이벤트 할당
		$('body').on('click', '.paging a', function(e) {
			// a태그의 href 이벤트 취소
			e.preventDefault();
			var url = $(this).attr('href');
			Ajax.execute({
				url: url,
				type: 'get',
				dataType: 'html',
				success: function(html) {
					// $target에 html을 다시 그려줌.
					options.$target.html(html);
					// 콜백이 필요한경우
					if (options.callback) {
						// 콜백 함수에 html을 jQuery로 사용가능하게 만들어서 콜백 해줌.
						options.callback($(html));
					}
				}
			});
			return false;
		});
	}

};

/**
 * jQuery.ajax 커스터마이징 클래스
 */
var Ajax = {

	/**
	 * jQuery.ajax을 활용하여 서버로 전송하고 응답에 따라 에러메세지를 출력 성공인경우는 callback 함수를 호출해준다.
	 * @param options
	 */
	execute: function(options) {
		var url = options.url;
		if (!options.dataType) {
			options.dataType = "json";
		}
		if (!options.type) {
			options.type = "post";
		}
		if (!options.contentType) {
			options.contentType = "application/x-www-form-urlencoded";
		}
		if (options.async == undefined) {
			options.async = true;
		}
		if (options.loading == undefined) {
			options.loading = true;
		}

		var self = this;
		$.ajax({
			url: url,
			dataType: options.dataType,
			contentType: options.contentType,
			data: options.data,
			async: options.async,
			type: options.type,
			beforeSend: function() {
				if (options.loading) {
					self.loadingStart();
				}
			},
			success: function(response) {
				self.commonResponse(options, response);
			},
			error: function(xhr, status, err) {
				var json = $.parseJSON($.trim(xhr.responseText));
				var message = json.message;
				var errorFormElementName = json.errorFormElementName;
				var errorFormElementIndex = json.errorFormElementIndex;
				// 에러메세지 보여줌
				if (message != null && message.length > 0) {
					alert(message);
					if (errorFormElementName != null && errorFormElementName.length > 0) {
						var $form = options.$form;
						// 폼을 파라메터로 넘긴경우
						if ($form != undefined) {
							// 객체를 찾아 포커스
							var $obj = $form.find("[name=" + errorFormElementName + "]").eq(errorFormElementIndex);
							if ($obj.length == 1) {
								$obj.focus();
							}
						}
					}
				}
				// 에러 콜백함수가 존재하는경우 콜백
				if (options.error != undefined) {
					options.error(xhr, status, err);
				}
			}
		});
	},

	/**
	 * 파일업로드 전용 ajax
	 * @param options
	 */
	executeUpload: function(options) {
		options.dataType = 'json';
		var self = this;
		$(options.target).ajaxForm({
			url: options.url,
			enctype: 'multipart/form-data',
			type: 'POST',
			success: function(response) {
				self.commonResponse(options, response);
			},
			error: function() {
			}
		});
	},

	/**
	 * 공통 응답 처리
	 */
	commonResponse: function(options, response) {
		if (options.loading) {
			this.loadingEnd();
		}
		if (options.dataType == 'json') {
			// alert으로 메세지를 보여주는 경우
			if (response.messageType == 'ALERT') {
				if (response.code == 'SUCCESS') {
					options.success(response);
				} else if (response.code == 'VALIDATE_LOGIN') {
					alert(response.message);
					if (opener) {
						opener.location.href = '/member/login';
						self.close();
					} else {
						location.href = '/member/login';
					}
				} else if (response.code == 'REDIRECT_MAIN') {
					location.href = '/main';
				} else if (response.code == 'MEMBER_TEACHER_CERTIFY') {
					location.href = '/member/memberReCertify';
				} else if (response.code == 'EVENT_SURVEY_ERROR') {
					alert(response.message);
					window.location.reload();
				} else {
					alert(response.message);
					if(response.code == "EXCEPTION") {
						if (options.error != undefined) {
							options.error();
						}
					}
					if(response.code == "JOIN_EXIST_EMAIL") {
						if(options.error != undefined) {
							options.error("E");
						}
					}

				}
			} else {
				options.success(response);
			}
		} else {
			// html일경우 성공이 아닐경우 에러메세지는 json 구조
			if (response.startsWith('{')) {
				// Object로 사용가능하게 변환
				response = JSON.parse(response);
				// json 형태의 데이터 일경우
				if (response) {
					if (response.code == 'VALIDATE_LOGIN') {
						alert(response.message);
						if (opener) {
							opener.location.href = '/member/login';
							self.close();
						} else {
							location.href = '/member/login';
						}
					} else if (response.code == 'MEMBER_TEACHER_CERTIFY') {
						alert(response.message);
						if (opener) {
							opener.location.href = '/member/memberReCertify';
							self.close();
						} else {
							location.href = 'member/memberReCertify';
						}
					} else if (response.code != 'SUCCESS') {
						alert(response.message);
						return false;
					}
				} else {
					options.success(response);
				}
			} else {
				options.success(response);
			}
		}
	},

	loadingStart: function() {
		$('#ajax-loading').show();
	},

	loadingEnd: function() {
		$('#ajax-loading').hide();
	}

};

// 최상단 검색 핸들러
var SearchHanlder = {
	STORAGE_NAME: 'STORAGE_SEARCH_HISTORY', // 검색어를 스토리지에 저장될 이름
	init: function() {
		// 검색 wrap
		var $searchWrap = $('#search_wrap');
		// 검색어
		var $query = $searchWrap.find('input[name=query]');
		// 이전 검색어
		var prevQuery = $query.val() != "" ? $query.val() : "";

		// 이전 검색어가 존재하는 경우 검색 영역을 보여줌
		if (prevQuery.length > 0) {
			$searchWrap.addClass('on');
		}

		// 검색어 자동완성 이벤트
		$query.bind('keyup', function(e) {
			// 엔터를 입력하는 경우
			if (e.keyCode == 13) {
				// 검색 버튼 강제 클릭 이벤트
				$searchWrap.find('.btn_search').trigger('click');
				return false;
			}

			// 한글 입력일 경우 IME에 의해 반복적으로 데이터 요청하는 것을 방지하기 위해..
			if(prevQuery == $query.val()) {
				return false;
			}

			prevQuery = $query.val();
		});
		// 검색창 포커스 아웃했을때 글자없으면 이슈키워드 재노출
		$query.bind("focusout", function(e){
			setTimeout(function () {
				if ($query.val() == "") {
					$('#issueKeyword').show();
				}
			}, 200);
		});

		// 검색 이벤트
		$searchWrap.find('.btn_search').bind('click', function() {
			// 검색어가 없는 경우
			if ($query.val().length === 0 || $query.val().trim() == '') {
				location.href="/creative/subject/operate/list";
				// 검색 영역이 안 보일 때
				if (!$searchWrap.hasClass('on')) {
					$searchWrap.addClass('on');
				}
				// 검색 영역이 보일 때
				else {
					$searchWrap.removeClass('on');
				}

				return false;
			} else {
				SearchHanlder.search($query.val(), $query.val().length > 0);
				$query.val('');
				return false;
			}
		});
	},

	/**
	 * 검색페이지로 이동한다.
	 * @param value
	 * @param save
	 */
	search: function(value, save) {
		if (window.globals.login && save) {
			// 검색어를 저장해야 하는 경우
			StorageUtils.addValue(SearchHanlder.STORAGE_NAME, value, {
				limit: 8, // 갯수제한
				filter: true // 중복필터
			});
		}
		// 로그인 체크
		if (window.globals.login) {
			window.open('/search?query=' + encodeURIComponent(value), 'search');
		} else {
			location.href = '/search?query=' + value;
		}
	},
};

/*function getMyTextbookCnt(){
	// 교과서 수 가져오기
	$.ajax({
		url: '/quickMenu/myTextbookCnt',
		type: 'GET',
		success: function (response) {
			if (response.code === 'SUCCESS') {
				$("#textbookCount").text(response.response);
			}
		},
		error: function (xhr, status, error) {
			console.error("실패:", error);
		}
	});
}*/

function getQuickMenuMyTextbookList() {
	// 내 교과서 목록 가져오기
	$.ajax({
		url: '/quickMenu/myTextbookList',
		type: 'GET',
		success: function (response) {
			const educourseInfoList = response.response.educourseInfoList;
			const textbookInfo = response.response.textbookInfo;

			if (educourseInfoList && educourseInfoList.length > 0) {
				let htmlContent = '';
				// 리스트  생성
				educourseInfoList.forEach(function (educourseInfo, index) {
					let filePath = (educourseInfo.schoolLvlCd === "MS" && educourseInfo.mdValue == "2022" )? 'https://dn22.vivasam.com/' : 'https://dn.vivasam.com/';
//					let domain = window.globals.config.siteDomainMiddleHigh;
					htmlContent += `
						<div class="swiper-slide" data-educourse-id="${educourseInfo.educourseId}" data-orderNo="${index + 1}">
							<div class="book_img_box">
								<div class="hover_box">
									${window.globals.memberSchCode === "ES" ? `
										<a class="btn_arrow11" href="/textbook/list?eduClsCode=${educourseInfo.mdValue}&textbookCd=${educourseInfo.educourseId}">
										<img src="${filePath + educourseInfo.thumbnailPath}" alt="교과서" />
											<span class="blind">상세페이지</span>
										</a>
									` : `
										<a class="btn_arrow22" href="https://v.vivasam.com/educourse/index.do?textbookCd=${educourseInfo.educourseId}">
										<img src="${filePath + educourseInfo.thumbnailPath}" alt="교과서" />
											<span class="blind">상세페이지</span>
										</a>
									`}
								</div>
			
								<!--<img src="${'https://dn.vivasam.com/'+ educourseInfo.thumbnailPath}" alt="교과서" />-->
							</div>
			
						</div>
					`;
				});
				$("#quick-swiper").show();
				$('#quickMenu .nodata').html("");
				$('#quickMyClassbook').html(htmlContent);
				$("#textbookCount").text("("+educourseInfoList.length+")");

				// 퀵메뉴 내 교과서 스와이프
				const quickSwiper = new Swiper(".quick-swiper", {
					slidesPerView: 1,
					spaceBetween: 10,
					loop: true,
					observer: true,
					observeParents: true,
					navigation: {
						nextEl: '.quickNext',
						prevEl: '.quickPrev',
					},
				})

			} else {
				// '내 교과서'가 없을 때 처리
				let noDataHtml = `
							<div class="nodata">
								<p class="sub_txt">내 교과서를 설정하여 자료를 쉽게 찾아 보세요.</p>
							</div>
						`;
				$("#quick-swiper").hide();
				$('#quickMenu .nodata').html(noDataHtml);
				$("#textbookCount").text("");
			}
		},
		error: function (xhr, status, error) {
			console.error("실패:", error);
		}
	});
}

$(function() {
	// 플로팅 배너
	if (!$.cookie("topbanner")) {
		$("#floatBanner").show();
	} else {
		$("#floatBanner").hide();
	}
	// 내교과서 수량
	//getMyTextbookCnt();
	// 내교과서 리스트
	getQuickMenuMyTextbookList();

	// gate 관련 쿠키
	if (location.href.includes(globals.config.siteDomainElementary)) {
		$.cookie('gate', 'E', {expires: 30, path: '/', domain: globals.config.sessionDomainName});
	}

	// 공통 페이지에서 링크 버튼 클릭시 교사 인증 안내 체크
	$('.btn-member-valied-check').bind('click', function (e) {
		// 미인증 시 이벤트 취소
		SessionUtils.confirmValidMember(function (valid) {
			if (!valid) {
				e.preventDefault();
			}
		})
	});

	// 공통 페이지에서 버튼 스크립트로 로그인 체크 이벤트
	$('.btn-login-check').bind('click', function (e) {
		if (!SessionUtils.isLogin($(this).attr('href'))) {
			e.preventDefault();
		}
	});

	// 공통 지사안내 클릭 이벤트
	$('.btn-public-branch-popup').bind('click', function () {
		Popup.openPublicBranch();
	});

	// 공통 파일 다운로드 (컨텐츠 아이디 고정형) 클릭 이벤트
	$('body').on('click', '.btn-file-download-dext', function () {
		var contentId = $(this).data('content-id');
		contentId = String(contentId);
		Popup.openFileDownloadDext(contentId);
	});

	// 공통 동영상 플레이어 (동영상 URL 고정형) 클릭 이벤트
	$('body').on('click', '.btn-viewer-starplayer', function () {
		Popup.openViewerStarplayer($(this).data().url);
	});

	// 공통 레이아웃이 붙는 경우만 실행
	if ($('body').hasClass('default-layout')) {
		LayoutHandler.makeTextbookSelectBox();
		LayoutHandler.loadSubmenu();
		LayoutHandler.loadEventInfo();
		LayoutHandler.loadIssueKeyword();
		LayoutHandler.handleSidemenu();
		LayoutHandler.handleQuickmenu(1);
		SearchHanlder.init();
	}

	// 검색 영역 클릭 이벤트
    $('#mainsearch').on('click', function (e) {
		e.preventDefault();
		$('#issueKeyword').hide();
  	});

	if ($('body').hasClass('default-layout') || $('div').hasClass('gate')) {
		/* 브라우저가 IE인지 감지 */
		if (navigator.userAgent.indexOf('Trident') > -1 && !$.cookie("IeEnd")) {
			$("#IeEnd").show();
		}
	}
	// localStorage.quickMenu = "open";
	//체크퀵메뉴
	if(localStorage.getItem("quickMenu") == 'close'){
		var $quickMenu = $('#quickMenu');
		var $quickevt = $('.quickevt_banner'); //퀵메뉴 이벤트 배너
		var $quickBanner = $('.viversam_menu2.event'); //퀵메뉴 비버샘 홍보 배너
		$quickMenu.toggleClass('q_open');
		$quickMenu.find('.pseudo').animate({ opacity: '0' }, 100, 'linear');
		$quickMenu.find('.quick_menu_visual').animate({ opacity: '0' }, 100, 'linear');
		$quickMenu.stop(true).animate({ right: '-100px' }, 0, 'linear');
		$quickMenu.find('.pseudo').css('z-index', 30).css('display', 'block').animate({ opacity: '1' }, 0, 'linear');
		$quickMenu.find('.quick_menu_visual').css('z-index', 30).animate({ opacity: '1' }, 0, 'linear');
		$quickevt.stop(true).animate({ right: '60px' }, 0, 'linear');
		$quickBanner.removeClass('on');
	} else {
		$(".viversam_menu2.event").addClass('on');
	}

	// 모바일 앱 팝업
	$('#btnAppPop').click(function (){
		Layer.openLayer({
			url: '/commonPop/mobileApp.popup',
			callback: function ($div) {
				$div.find('.close').bind('click', function () {
					$div.remove();
				});
			}
		});
	});

	// 메인 이벤트 리스트 팝업
	$('#mainEventListPopBtn').click(function (){
		Layer.openLayer({
			url: '/main/event/list.popup',
			callback: function ($div) {
				$div.find('.close').bind('click', function () {
					$div.remove();
					$('body').css('overflow-y', 'unset' );
				});
				$('.dimmed, .allEventListPopup').on('click', function(){
					$div.remove();
					$('body').css('overflow-y', 'unset' );
				});
			}
		});
		$('body').css('overflow-y', 'hidden' );
	});

	let mainUrl1 = String(window.location.href.substring(window.location.href.length - 4, window.location.href.length));
	let mainUrl2 = String(window.location.href.substring(window.location.href.length - 8, window.location.href.length));


	// 신학기 연구용 자료 팝업
	if (!$.cookie("2024popDataAsk")) {

		// 로그인 상태일 경우
		// 개발 및 운영
		if ( window.globals.login && ( mainUrl1 == "com/" || mainUrl1 == "main") && ( mainUrl2 == "com/main" || mainUrl2 == "sam.com/")) {
		// 학교급 추가
		// if (window.globals.login &&
		// 	(mainUrl1 === "com/" || mainUrl1 === "main") &&
		// 	(mainUrl2 === "com/main" || mainUrl2 === "sam.com/")
		// ) {

		// 로컬
		// if ( (window.globals.login && window.globals.member.schCode==='ES') || window.globals.login && window.globals.member.schCode==='MS') {
			// 운영 노출일 24.08.12 ~ 08.25 까지만 노출
			var start = new Date(2025, 2, 12);
			var end = new Date(2025, 2, 27);

			// 테스트용 노출
			// var start = new Date(2024, 7, 12);
			// var end = new Date(2024, 7, 25);
			var today = new Date();

			if (start <= today && today < end) {

				Layer.openLayer({
					url: '/commonPop/dataAsk.popup',
					callback: function ($div) {
						// 다시 보지 않기
                        $(document).on("click", "#2024semesterPop", function(){
							if ($(this).prop('checked')) {
								// 일자만 저장
								$.cookie('2024popDataAsk', true, {expires: 365, path: '/'});
								$div.remove();
							}
						});
						$div.find('.btn_close').bind('click', function () {
							$div.remove();
						});

						//신학기 자료 팝업 신청하기
						$('#main_pop210330 .btnWrap .btnLink').on('click',function(){
							//교사 인증 체크
							if ($('.teacherCertifiedYn').val() !== 'Y') {
								alert("교사 인증 후 이벤트에 참여해 주세요.");
								return false;
							}
							// 준회원
							if (!$('.mLevel').val() || $('.mLevel').val() === 'AU400'){
								alert("준회원은 이용이 불가능합니다. \n비바샘으로 문의해 주세요. (1544-7714)");
								return false;
							}
							if($('.StudyJoinYn2023').val() != 'N') {
								alert("이미 신청하셨습니다.");
								return;
							}
							Layer.openLayer ({
								url: '/commonPop/dataAskApply.popup',
								callback: function ($div) {
									$div.addClass('on')

									$('.research_pop .btnEvtPopClose').on('click', function(){
										$div.remove();
									});

								}
							})
						});
					}
				});
			}
		}
	}

	// 초등과학결손단원수업자료신청
	lostScienceContent2025();

	// 퀵메뉴 비버샘 캐릭터 문구 하나 가져와서 셋팅하기
	quickMenuCharacterWord();
	
	// cdn 컨텐츠 에러 검사
	contentErrorListener();
});

// 초등과학결손단원수업자료신청 팝업
function lostScienceContent2025() {
	if($.cookie("lostScienceContent2025")) return;

	if (!window.globals.login || (window.globals.login && !$.cookie("lostScienceContent2025" + globalUtils))) {

		const mainUrl1 = String(window.location.href.substring(window.location.href.length - 4, window.location.href.length));
		const mainUrl2 = String(window.location.href.substring(window.location.href.length - 8, window.location.href.length));

		// 로그인 상태일 경우
		// 개발 및 운영
		if (( mainUrl1 == "com/" || mainUrl1 == "main") && (mainUrl2 == "om//main" ||  mainUrl2 == "com/main" || mainUrl2 == "sam.com/")) {

		// 학교급 추가
		// if (window.globals.login &&
		// 	(mainUrl1 === "com/" || mainUrl1 === "main") &&
		// 	(mainUrl2 === "com/main" || mainUrl2 === "sam.com/") &&
		// 	(window.globals.member.schCode === 'ES' || window.globals.member.schCode === 'MS')
		// ) {

		// if (window.location.href.includes("/main")) {

			// 로컬
		// if ( (window.globals.login && window.globals.member.schCode==='ES') || window.globals.login && window.globals.member.schCode==='MS') {
			// 운영 노출일 24.08.12 ~ 08.25 까지만 노출
			var start = new Date('2025-03-06');
			var end = new Date('2025-03-15');

			// 테스트용 노출
			// var start = new Date(2024, 7, 12);
			// var end = new Date(2024, 7, 25);
			var today = new Date();

			if (start <= today && today < end) {

				Layer.openLayer({
					url: '/commonPop/lostScienceContent2025.popup',
					callback: function ($div) {
						// 다시 보지 않기
						$(document).on("click", "#2024semesterPop", function(){
							if ($(this).prop('checked')) {
								// 일자만 저장
								$.cookie('lostScienceContent2025' + globalUtils, true, {expires: 365, path: '/'});
								$div.remove();
							}
						});
						$div.find('.btn_close').bind('click', function () {
							$div.remove();
						});

						// 채택학교 '결손 단원 수업 자료' 신청하기
						$('#main_pop250307 .btnLink1').on('click',function(){
							// 로그인 안됐을 경우 처리
							if (!window.globals.login) {
								alert('로그인 후 참여해 주세요.');
								location.href = "/member/login?goURL=" + location.pathname;
								return false;
							}

							//교사 인증 체크
							if ($('.teacherCertifiedYn').val() !== 'Y') {
								alert("교사 인증 후 이벤트에 참여해 주세요.");
								return false;
							}
							// 준회원
							if (!$('.mLevel').val() || $('.mLevel').val() === 'AU400'){
								alert("준회원은 이용이 불가능합니다. \n비바샘으로 문의해 주세요. (1544-7714)");
								return false;
							}

							if(window.globals.memberSchCode!=='ES'){
								alert("초등 교사만 참여 가능한 이벤트입니다.");
								return false;
							}

							if($('.lostContentJoinYn2025_1').val() != 'N') {
								alert("이미 신청하셨습니다.");
								return;
							}

							$('#adoptedYnChecked').val("Y");

							Layer.openLayer ({
								url: '/commonPop/lostScienceContent2025Apply.popup',
								callback: function ($div) {
									$div.addClass('on')

									$('.research_pop .btnEvtPopClose').on('click', function(){
										$div.remove();
									});
								}
							})
						});

						// 비채택학교 '결손 단원 수업 자료' 신청하기
						$('#main_pop250307 .btnLink2').on('click',function(){
							// 로그인 안됐을 경우 처리
							if (!window.globals.login) {
								alert('로그인 후 참여해 주세요.');
								location.href = "/member/login?goURL=" + location.pathname;
								return false;
							}

							//교사 인증 체크
							if ($('.teacherCertifiedYn').val() !== 'Y') {
								alert("교사 인증 후 이벤트에 참여해 주세요.");
								return false;
							}
							// 준회원
							if (!$('.mLevel').val() || $('.mLevel').val() === 'AU400'){
								alert("준회원은 이용이 불가능합니다. \n비바샘으로 문의해 주세요. (1544-7714)");
								return false;
							}

							if(window.globals.memberSchCode!=='ES'){
								alert("초등 교사만 참여 가능한 이벤트입니다.");
								return false;
							}

							if($('.lostContentJoinYn2025_2').val() != 'N') {
								alert("이미 신청하셨습니다.");
								return;
							}

							if(parseInt($('.amount_3').val()) <= 0) {
								alert("자료가 모두 소진되어 신청 마감되었습니다.");
								return;
							}

							$('#adoptedYnChecked').val("N");

							Layer.openLayer ({
								url: '/commonPop/lostScienceContent2025Apply.popup',
								callback: function ($div) {
									$div.addClass('on')

									$('.research_pop .btnEvtPopClose').on('click', function(){
										$div.remove();
									});
								}
							})
						});

						$('#main_pop250307 .btnTodayCloz').on('click', function(){
							$.cookie('lostScienceContent2025', true, {expires: 1, path: '/'});
							$('#main_pop250307').hide();
						});

						$('#main_pop250307').show();
					}
				});
			}
		}
	}
}

// 우편번호 검색 후 콜백정보
function callbackJuso(data) {
	$('#postNo_1').val(data.zip);
	$('#address1').val(data.addr);
}

/**
 * 단축 URL
 */
var CopyShortUrl = {
	/**
	 * URL 클립보드에 복사
	 */
	copy: function(url, noSave) {
		if (!SessionUtils.isLogin(location.href)) {
			return false;
		}
		SessionUtils.confirmValidMember(function(valid) {
			if (valid) {
				if (window.clipboardData) {
					window.clipboardData.setData("Text", url);
				} else {
					var textarea = document.createElement('textarea');
					textarea.value = url;

					document.body.appendChild(textarea);
					textarea.select();
					textarea.setSelectionRange(0, 1000);

					document.execCommand('copy');
					document.body.removeChild(textarea);

					alert("링크 주소를 복사하였습니다.\n붙여넣기 (Ctrl+V)하여 사용해 주세요.");

					// 클릭 로그 저장 안함(단축URL로 복사하는 경우가 아닌 경우)
					if (noSave) return;

					// 클릭 로그 저장
					var data = {
						shortUrl: url
					};
					Ajax.execute({
						url: '/shorturl/updateShortUrlCopy.json',
						data: data,
						type: 'post',
						dataType: 'json',
						success: function() {

						}
					});
				}
			}
		});
	},
	/**
	 * 단축 URL 받아오기
	 */
	getUrl: function(part, id) {
		if (!SessionUtils.isLogin(location.href)) {
			return false;
		}
		SessionUtils.confirmValidMember(function(valid) {
			if (valid) {
				var data = {
					part: part,
					id: id
				};
				Ajax.execute({
					url: '/shorturl/getShortUrl.json',
					data: data,
					type: 'post',
					dataType: 'json',
					success: function(msg) {
						if (msg.response != "") {
							CopyShortUrl.copy(msg.response);
						} else {
							alert("복사할 링크 주소가 없습니다.");
						}
					}
				});
			}
		});
	}
}

/**
 * 팝업 display none 처리
 */
function closePopup(elementId) {
	$("#" + elementId).hide();
	var videoTags = $("#timetablePopWrap").find("video");
	// 비디오 태그가 있으면 모두 일시정지
	for (var i = 0; i < videoTags.length; i++) {
		videoTags[i].pause();
	}
}

/**
 * 다시 보지 않기 처리(체크박스)
 */
function checkNoShowCheck(self, elementId, day) {
	console.log(self, elementId, day);
	if($(self).is(":checked")) {
		$.cookie(elementId, true, {expires: day, path: '/'});
	} else {
		$.removeCookie(elementId, {path: '/'});
	}
}

/**
 *  다시 보지 않기 처리(클릭)
 */
function checkNoShow(elementId, day) {
	$("#" + elementId).hide();
	$.cookie(elementId, true, {expires: day , path: '/'});
}

// 구독버튼 클릭
function subscription() {
	if (SessionUtils.isLogin()) {
		Ajax.execute({
			type: 'post',
			url: "/member/chkVMagazineUser.json",
			dataType: 'json',
			success: function(result) {
				var data = result.response;
				var code = data.code;
				var msg = data.msg;
				if (code == "0000") {
					$('#subscription_dim').show();
				} else {
					alert(msg);
				}
			}
		});
	}
}

// v 메거진 구독
function applyVMagazine() {
	if (!$('#infocheck').is(':checked')) {
		alert('개인정보 수집 및 이용 동의에 체크해주세요.');
		return;
	}
	Ajax.execute({
		url: '/member/applyVMagazineUser.json',
		data: {},
		type: 'post',
		dataType: 'json',
		success: function(data) {
			var code = data.response.code;
			var msg = data.response.msg;
			if (code === "0000") {
				alert('V.MAGAZINE 정기 구독이 정상적으로 신청되었습니다. 감사합니다.');
			} else if (code === "9999") {
				alert('V.MAGAZINE 정기 구독 신청이 마감되었습니다.');
			} else {
				alert(msg);
			}
		}
	});
}

// 회원 수정 페이지 보내기
function moveModifyUser() {
	if (!confirm('휴대전화번호 또는 재직학교 정보 수정을 위해 개인정보 수정 페이지로 이동하시겠습니까?')) {
		return;
	}
	location.href = '/my/info/check';
}

// 마케팅 수신 동의 처리
function setMarketAgree() {
	Ajax.execute({
		url: '/member/marketing/info',
		data: JSON.stringify({
			marketingEmailYn: $("#marketChk02").is(":checked") ? "Y" : "N",
			marketingSmsYn: $("#marketChk01").is(":checked") ? "Y" : "N",
			marketingTelYn: $("#marketChk03").is(":checked") ? "Y" : "N"
		}),
		contentType: 'application/json',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			alert("저장되었습니다.");
			location.reload();
		}
	});
}

// 유튭 url 파싱
function getYoutubeId(val) {

	var result;

	if(val && val.indexOf("youtu") > 0) {
		if (val.indexOf("watch?") > 0) {
			result = val.split("v=")[1];
		} else if (val.indexOf("youtu.be/") > 0) {
			result = val.split("youtu.be/")[1];
		}
	}

	return result;
}

function checkLoginForMainOnlinePopup() {
	if(globals.login) {
		$.cookie('main_pop210225', true, {expires: 1, path: '/'});
		location.href='/main';
	} else {
		location.href = "/member/login";
	}
}

function goClassHelper(type, naviOpen) {
	var ClassHelperURL = "https://dn.vivasam.com/api/class";
	var width = 1280;
    var height = 677;

    const agent = navigator.userAgent.toLowerCase();
    var browser;

    if (/safari/.test(agent) && !/chrome/.test(agent)) {
        browser = "safari";
        height = 706;
    }
    else if(/edg/.test(agent)) {
        browser = "edge";
    }

    var left = Math.ceil((window.screen.width - width)/2);
    var top = Math.ceil((window.screen.height - height)/2);

    // dual monitor
    if (window.screen.availLeft > 0) {
        left += (window.screen.availLeft);
    }

    var options = "width=" + width + ",height=" + height + ",left=" + left + ",top=" + top + ",resizable=yes,scrollbars=no";
    var naviOpenValue = 0;
    if (!naviOpen) {
    	naviOpenValue = 1;
    }
    var newWindow = window.open(ClassHelperURL + "/index.html?type=" + type + "&navOpen=" + naviOpenValue, "dafault", options);
    newWindow.focus();
}

function goSamHelper() {
	var SamHelperURL = "https://smart-dn.visang.com/appData/samhelper/html/download.html";
	window.open(decodeURIComponent(SamHelperURL), '_blank');
}

//롤링 배너
$.fn.rollingBanner = function(time, navi) {
	var o = $(this);
	var bannerLength = o.find('ul li').length;
	var idx = 0;
	var setTime;

	if( bannerLength > 1 ) {

		if(navi == false){
			o.find('ul li').hide();
			o.find('ul li').eq(0).show();
			o.find('ol li').eq(0).find('a').addClass('on');
		} else {
			o.append('<ol></ol>');

			for(var i=0; i<bannerLength; i++) {
				if( i == 0) {
					o.find('ol').append('<li><a href="#" class="on">' + i + '</a></li>');
				}else {
					o.find('ol').append('<li><a href="#">' + i + '</a></li>');
					o.find('ul li').eq(i).hide();
				}
			}
		}


		if( time != undefined ) {
			setTime = setTimeout(roll, time);

			o.mouseover(function() {
				clearTimeout(setTime);
			})
			.mouseout(function() {
				setTime = setTimeout(roll, time);
			});
		}

		o.find('ol li a').click( function() {
			var n = $(this).parent().index();
			bannerPage(n);
			return false;
		});
	}

	function bannerPage(n) {
		o.find('ol li a').removeClass('on');
		o.find('ol li').eq(n).find('a').addClass('on');
		o.find('ul li').eq(idx).hide();
		idx = n;
		o.find('ul li').eq(n).show();
	}

	function roll() {
		o.find('ul li').eq(idx).hide();

		if(idx > bannerLength-2) { idx = 0; }
		else { idx++; }

		bannerPage(idx);
		o.find('ul li').eq(idx).show();

		if( time != undefined ) {
			setTime = setTimeout(roll, time);
		}
	}
}

var snsLoginFunction = function(object) {
	Ajax.execute({
		url : '/member/signInVivasam.json',
		data : JSON.stringify({
			'snsLoginParameter' : object
		}),
		contentType : 'application/json',
		method : 'post',
		dataType : 'json',
		success : function(result) {
			var code = result.response.code;
			var redirectURL = result.response.redirectURL;
			var msg = result.response.msg;
			if (code != 'fail') {
				// 구글 로그인 통계 남김.
				GoogleAnalyticsUtils.sendLoginInfo();
				if (redirectURL != null && redirectURL != '') {
					var goURL = $('#goURL').val();
					if (redirectURL == '/main' && goURL != '' && typeof goURL != 'undefined') {
						location.href = goURL;
					} else {

						location.href = redirectURL;
					}
				} else if (location.href.includes("/aidt")) {
					location.href = window.location.pathname;
				} else {
					location.href = '/main';
				}
			} else {
				if (code == 'sns_fail') {
					alert(msg);
				} else if (msg != null && msg != '') {
					$("div.lBox .msg").html(msg);
				}
			}
		}
	});
}
var quickSnsLoginInPage = function(object) {
	Ajax.execute({
		url: '/member/signInVivasam.json',
		data: JSON.stringify({
			'snsLoginParameter' : object
		//	,goUrl: window.location.href
		}),
		contentType: 'application/json',
		method: 'post',
		dataType: 'json',
		success: function(result) {
			if (result.response.code == null) {
				// 구글 로그인 통계 남김.
				GoogleAnalyticsUtils.sendLoginInfo();
			}
			var redirectURL = result.response.redirectURL;
			var msg = result.response.msg;
			if (StringUtils.isNotEmpty(redirectURL)) {
				// aidt redirect 처리
				if (location.href.includes("/aidt")) {
					location.href = window.location.pathname;
					return;
				}
				// 메인페이지로 리다이렉트 인경우는 현재 보고 있는 페이지로 리로드 되게..
				if (redirectURL == '/main') {
					location.reload();
				} else {
					location.href = redirectURL;
				}
			}
			if (StringUtils.isNotEmpty(msg)) {
				alert(msg);
			}
		}
	});
};

/*  사이드 메뉴 공통 스크립트 */
var sideMenuBanner = {
	fileDownload : function(content){
		Popup.openFileDownloadDext("CN030-" + content);
	}
};

// 내 수업
function popMyClass(section) {
	// ga태그(?)
	if (!SessionUtils.isLogin(location.href, '로그인이 필요한 서비스입니다.')) {
		return;
	}

	/*if (section === 'myClass') {
		alert("준비 중입니다.");
		return;
	}*/

	var validMember = false;
	SessionUtils.confirmValidMember(function (valid) {
		validMember = valid;
	});

	if (!validMember) {
		return;
	}

	Layer.openLayer({
		url: '/quickMenu/myDataList.popup',
		callback: function () {
			setContent(section);
		}
	});
}

function setContent(section) {
	// 탭 초기화
	$('.tab_item').removeClass('on');
	$('.contentData').hide();

	// 해당 섹션의 탭에 'on' 클래스 추가
	if (section === 'recent') {
		$('#recentTab').addClass('on');
		$('.recentContent, .recentP').show();
		$('.myClassP, .myClassA, .putDataP, .putDataA').hide();
	} else if (section === 'myClass') {
		$('#myClassTab').addClass('on');
		$('.classContent, .myClassP, .myClassA').show();
		$('.recentP, .putDataP, .putDataA').hide();
	} else if (section === 'putData') {
		$('#putDataTab').addClass('on');
		$('.putContent, .putDataP, .putDataA').show();
		$('.myClassP, .recentP, .myClassA').hide();
	}


	// 탭 클릭 시 해당 섹션으로 이동
	$('.tab_item').on('click', function () {
		var selectedTab = $(this).attr('id');
		// 이미 활성화 된 탭을 클릭하면 setContent 실행안함
		if ($(this).hasClass('on')) {
			return;
		}

		if (selectedTab === 'recentTab') {
			setContent('recent');
		} else if (selectedTab === 'putDataTab') {
			setContent('putData');
		}
	});

	$('.btn-viewer-main-open').on('click', function () {
		var data = $(this).data();
		Popup.openViewerMain(data.contentId, data.contentGubun);
	});

	// 런처 오픈
	$('.btn-lesson-open').on('click', function () {
		var data = $(this).data();
		var vivaclassLcHost = (window.globals.config.activeEnv.indexOf('prod') > -1) ? 'https://vivaclass-lc.vivasam.com' : 'https://s-vivaclass-lc.vivasam.com';
		window.open(`${vivaclassLcHost}?type=5&classPk=${data.classPk}&shareClassMapPk=${data.shareClassMapPk}`, '_blank');
	});

}

/* 시간표 팝업 오픈 */
function timeTablePop(from) {
	if (!SessionUtils.isLogin(location.href, '로그인이 필요한 서비스입니다.')) {
		return;
	}

	var validMember = false;
	SessionUtils.confirmValidMember(function(valid) {
		validMember = valid;
	});
	if (!validMember) {
		return;
	}

	if (!window.globals.elementaryByMemberInfo) {
		alert("초등 회원 전용 서비스입니다.");
		return;
	}

	// GA 처리
	var where = '메인_시간표레이어_수정버튼';
	if (from !== undefined) {
		if (from === 'quick') where = '퀵메뉴_수업시간표';
		else if (from === 'none') where = '메인_시간표레이어_최초설정버튼';
	}
	gtag('event', '시간표 팝업', {
		'event_category' : where,
		'event_label' : '시간표',
		'value': 1
	});

	var url = "/timetable/timetable.popup";
	var popTimetable = Popup.openWindow({
		name: 'timeTablePop',
		width: 1117,
		height: 1076,
		url:url,
	});

	var popupTick = setInterval(function() {
		if (popTimetable.closed) {
			// 시간표 타입(담임용, 전담용)만 설정한 경우 데이터 삭제
			clearInterval(popupTick);
			Ajax.execute({
				url: '/timetable/checkIfOnlyTeacherTypeSet.json',
				data : {vivasamformat : "json"},
				method : "post",
				dataType : "json",
				success: function(result) {
					var response = result.response;
					var resultCode = response.code;

					if(resultCode == "FAIL") {
						alert(response.msg);
					}
				}, complete: function () {
					if (typeof getMainPeriodList !== 'undefined') { // 메인화면에서만 새로고침
						getMainPeriodList(0); //메인화면 시간표 새로고침(ajax)
					}
				}
			});
		}
	}, 500);
}

$(function(){

	//gnb메뉴 점 색상 변경
	$('.gnb ul.gnbmenu li a').hover(function(){
		$(this).parent('li').next('li').addClass("afterOn");
	},function(){
		$(this).parent('li').next('li').removeClass("afterOn");
	});

	const $gnb = $('#gnb');
	const $gnbOpen = $gnb.find('.btnAllMenu');
	$gnbOpen.on('click', function(){
		$('#gnb-depth').stop().slideToggle(500);
		$(this).toggleClass('open');
		$('.gotop').toggleClass('hide')
	});

	$('#gnb-depth').on('click', '.gnb_close', function(){
		$('#gnb-depth').stop().slideUp(500);
		$gnbOpen.removeClass('open');
		$('.gotop').removeClass('hide');
	});



	//쌤채널 콘텐츠 변경
	let arr = $('.create_cont');
	let $cont = Array.from(arr);
	let $contChange = $('.contChange');
	let $tab = $('.conts.conts_create .tab_educourse li');
	let $categoryTab = $('.conts.conts_create .tab_menu.create');
	let $video = $('.create_cont').find('video');
	let $txtWarp = $('.conts_create .txt_wrap');

	$('.create_cont .btn_play').hide();

	if(arr.length > 0){
		$cont[1].classList.add('on');

		$contChange.on('click', ()=> {

			$contChange.toggleClass('on');

			if($contChange.hasClass('on')){

				$cont[0].classList.add('on');
				$cont[1].classList.remove('on');
				$tab.removeClass('on');
				$tab.eq(1).addClass('on');
				$categoryTab.hide();
				if($video.get(0)) {
					$video.get(0).play();
				}
				$txtWarp.hide();

			}else {

				$cont[0].classList.remove('on');
				$cont[1].classList.add('on');
				$tab.removeClass('on');
				$tab.eq(0).addClass('on');
				$categoryTab.show();
				if($video.get(0)) {
					$video.get(0).pause();
				}
				$txtWarp.show();
			}
		});

	}

	$('#tab-educourse li span').click(function(e){
		if($cont[0].classList.contains('on')){
			$cont[0].classList.remove('on');
			$cont[1].classList.add('on');
			$tab.addClass('on');
			$contChange.toggleClass('on');
			$categoryTab.show();
		}
	});

	// 샘스토리 탭
	$('.conts.conts_create #tab-educourse li .tab').on('click', function(e){
		const index = $(this).closest('li').index();

		//tab[0] 수업, tab[1] 선생님
		//$cont[0] 선생님 , $cont[1] 수업
		if(index === 1 ){
			$cont[1].classList.remove('on');
			$cont[0].classList.add('on');
			$tab.removeClass('on');
			$tab.eq(index).addClass('on');
			$contChange.addClass('on');
			$categoryTab.hide();
			if($video.get(0)) {
				$video.get(0).play();
			}
			$txtWarp.hide();
		} else {
			$cont[0].classList.remove('on');
			$cont[1].classList.add('on');
			$tab.removeClass('on');
			$tab.eq(0).addClass('on');
			$contChange.removeClass('on');
			$categoryTab.show();
			if($video.get(0)) {
				$video.get(0).pause();
			}
			$txtWarp.show();
		}
	});

	$('.popup_close').on('click', function (){
		$(".themePopupWrap.type1").removeClass('on');
	});

	//마우스 호버 시 공유하기 버튼 type1
	$(".btn_qr_share.on").on('mouseenter',function (){
		$('.share_pop.type1').addClass('on');
		if($(".share_pop.type1").hasClass('on')){
			$('.share_pop.type1').on('mouseleave', function (){
				$(this).removeClass('on');
			});
		}
	});
})

function sleep(ms) {
	const wakeUpTime = Date.now() + ms;
	while (Date.now() < wakeUpTime) {}
}

var fileNameList = [];
var filePathList = [];
var fileNameArr = [];
var filePathArr = [];
var downTimeArr = [];
function realDown(fileName, filePath){
	var a = document.createElement("a"); // a 태그 create
	a.href = filePath;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	sleep(500);
	document.body.removeChild(a);
}

function getFileSize(fileUrl) {
	const client = new XMLHttpRequest();
	client.open("GET", fileUrl, false);
	client.send();
	let contentLength = client.getResponseHeader("Content-Length");
	if(contentLength > 0){
		contentLength /= (1024*1024);
	}
	return Math.ceil(contentLength);
}

/*
var zip;
function jsZipLoad(){
	var script = document.createElement('script');
	script.src = "/resources/js/jszip.min.js";
	document.getElementsByTagName('head')[0].appendChild(script);

	var script2 = document.createElement('script');
	script2.src = "/resources/js/jszip-utils.min.js";
	document.getElementsByTagName('head')[0].appendChild(script2);

	var script3 = document.createElement('script');
	script3.src = "/resources/js/FileSaver.min.js";
	document.getElementsByTagName('head')[0].appendChild(script3);
}

function fileDownStart(){
	zip = new JSZip();
}
function urlToPromise(url) {
	return new Promise(function (resolve, reject) {
		JSZipUtils.getBinaryContent(url, function (err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}
*/

// 날짜 추가
Date.prototype.addDate = function(addYear, addMonth, addDay){
	var date = this;
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();

	return new Date(year + addYear, month + addMonth, day + addDay);
};

function quickMenuCharacterWord() {
	Ajax.execute({
		url: '/quickMenu/getCharacterWord.json',
		type: 'get',
		dataType: 'json',
		success: function(data) {
			if(data.code === 'SUCCESS') {
				if (data.response !== null && data.response !== undefined) {
					$(".viversam_txt").html(data.response.WORD);
					$(".viversam_url").attr("href", data.response.URL)
				}
			}
		}
	});
}

//jsZipLoad();

// 다운로드 완료 시 포인트 지급
function savePoint(downCompleteItems) {
	Ajax.execute({
		url: '/file/download/savePoint.json',
		type: 'post',
		data: {downList : JSON.stringify(downCompleteItems)},
		dataType: 'json',
		success: function(data) {
			//data.response = true 이면 정상
		}
	});
}

//쌤채널 저서 판매 링크 팝업 열기
function openSellBook (teacher) {

	Popup.openWindow({
		name: 'tripSellBook',
		width: 1217,
		height: 700,
		//url매개변수를 사용해서 함수의 매개변수 값을 팝업에 전달.
		url: "/creative/popup/sellBook.popup?data='"+ encodeURIComponent(teacher),
		callback: function () {

		}
	});




}

function sendGaTag(target) {
	var data = $(target).data();
	let event_name = data.gaEventName;
	let event_category = data.gaEventCategory
	let event_label = data.gaEventLabel;
	console.log(`event:${event_category}, event_category: ${event_name}, event_label: ${event_label}`);
	// name과 category 변경요청 옴
	gtag('event', event_category, {
		'event_category': event_name,
		'event_label': event_label
	});
}
//퀵메뉴 비버샘 홍보 배너
function viversmaEvt(){
	$(".viversam_menu2.event").hide();
}

//url로 공유 > 비바클래스 팝업
function vivaClassPopup(dataUrl){
	// 로그인 체크
	if (SessionUtils.isLogin(location.href)) {
		// 교사인증 체크
		SessionUtils.confirmValidMember(function (valid) {
			if (valid) {
				// 비바클래스 목록 가져오기
				Ajax.execute({
					url: '/vivaclass/classList',
					type: 'post',
					success: function(data) {
						let classlist = data.response;
						if (!classlist) {
							alert('일시적으로 비바클래스 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.');
							return;
						}

						if(classlist.length < 1) {
							$(".themePopupWrap.type1").addClass('on');
							$(".share_pop.vivaclass#noneadminViva").addClass('on');
							$(".themePopupWrap .share_pop.type2").hide();
						} else {
							$("#btnShareVivaclassNow").data("url", dataUrl);
							$("#selForm1 #class1").html('');
							var classOptItem = '';
							var className = '';
							for (var i = 0; i < classlist.length; i++) { // 비바클래스 목록 셀렉박스 셋팅
								className = classlist[i].schName + ' ' + classlist[i].clsName;
								classOptItem = '<option value="'+classlist[i].classSeq+'">'+className+'</option>';
								$("#selForm1 #class1").append(classOptItem);
							}
							$(".themePopupWrap.type1").addClass('on');
							$(".share_pop.vivaclass#adminViva").addClass('on');
							$(".themePopupWrap .share_pop.type2").hide();
						}
					}
				});
			}
		});
	}
}

//url로 공유 > 비바클래스 팝업 (classSeq 고정)
function vivaClassPopupBySeq(dataUrl, classSeq){
	// 로그인 체크
	if (SessionUtils.isLogin(location.href)) {
		// 교사인증 체크
		SessionUtils.confirmValidMember(function (valid) {
			if (valid) {
				// 비바클래스 목록 가져오기
				Ajax.execute({
					url: '/vivaclass/classList',
					type: 'post',
					success: function(data) {
						let classlist = data.response;
						if (!classlist) {
							alert('일시적으로 비바클래스 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.');
							return;
						}

						if(classlist.length < 1) {
							$(".themePopupWrap.type1").addClass('on');
							$(".share_pop.vivaclass#noneadminViva").addClass('on');
							$(".themePopupWrap .share_pop.type2").hide();
						} else {
							$("#btnShareVivaclassNow").data("url", dataUrl);
							$("#selForm1 #class1").html('');
							var classOptItem = '';
							var className = '';
							for (var i = 0; i < classlist.length; i++) { // 비바클래스 목록 셀렉박스 셋팅
								if(classSeq == classlist[i].classSeq) {
									className = classlist[i].schName + ' ' + classlist[i].clsName;
									classOptItem = '<option value="'+classlist[i].classSeq+'">'+className+'</option>';
									$("#selForm1 #class1").append(classOptItem);
									$('#selForm1 #class1').prop('disabled', true);
								}
							}
							$(".themePopupWrap.type1").addClass('on');
							$(".share_pop.vivaclass#adminViva").addClass('on');
							$(".themePopupWrap .share_pop.type2").hide();
							$('#btnShareVivaclassNow').on('click', function() {
								$('.popup_close').click();
							});
						}
					}
				});
			}
		});
	}
}

//url로 공유 > 비바클래스 팝업 (런처용)
// todo: 추후 비바클래스 공유 팝업 기능 함수 공통화 해야함.
function vivaClassLauncherClass(masterContent){
	// getLauncherMemberAuthInfo(function (data) {
	// 	if (data === 'N' && window.globals.config.activeEnv.indexOf('prod') > -1) {
	// 		alert("준비 중입니다.");
	// 		return;
	// 	}
		// 로그인 체크
		if (SessionUtils.isLogin(location.href)) {
			// 교사인증 체크
			SessionUtils.confirmValidMember(function (valid) {
				if (valid) {
					// 비바클래스 목록 가져오기
					Ajax.execute({
						url: '/vivaclass/classListOnProgress',
						type: 'post',
						success: function (data) {
							let classlist = data.response;
							if (!classlist) {
								alert('일시적으로 비바클래스 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.');
								return;
							}

							classlist = $.grep(classlist, function (classItem) {
								// 중고등 담임, 활동, 교사 클래스는 수업 지원 불가 처리
								return !((classItem.schTypeCode === 'HS' || classItem.schTypeCode === 'MS') && classItem.clsTypeCode === '1')
									&& !(classItem.clsTypeCode === '3' || classItem.clsTypeCode === '4') && classItem.state === '1';
							});

							if (classlist.length < 1) {
								$(".themePopupWrap.type1").addClass('on');
								$(".popup.system_alert#noneadminVivaLauncher").show();
								$(".popup.system_alert#noneadminVivaLauncher").addClass('on');
								$(".themePopupWrap .share_pop.type2").hide();
							} else {
								var vivaclassLcHost = (window.globals.config.activeEnv.indexOf('prod') > -1) ? 'https://vivaclass-lc.vivasam.com' : 'https://s-vivaclass-lc.vivasam.com';
								var educourseId = masterContent.educourseId === undefined ? '' : masterContent.educourseId;
								var type1 = masterContent.type1 === undefined ? '' : masterContent.type1;
								var type2 = masterContent.type2 === undefined ? '' : masterContent.type2;
								vivaclassLcHost = vivaclassLcHost + '?type=10' +
									'&contentId=' + masterContent.contentId
									+ '&contentGubun=' + masterContent.contentGubun
									+ '&eduCourseId=' + educourseId
									+ '&type1Cd=' + type1
									+ '&type2Cd=' + type2;

								window.open(vivaclassLcHost, 'vcLcPopup');
							}
						}
					});
				}
			});
		}
	// });
}

// 비바클래스 클래스 만들기
function vivaClassCreate() {
	var vivaclassHost = (window.globals.config.activeEnv.indexOf('prod') > -1) ? 'https://vivaclass.vivasam.com' : 'https://dev-vivaclass.vivasam.com';
	window.open(vivaclassHost + '/myclass/edit');
}

// 비바클래스 공유하기
function vivaClassShare() {
	var vivaclassHost = (window.globals.config.activeEnv.indexOf('prod') > -1) ? 'https://vivaclass.vivasam.com' : 'https://dev-vivaclass.vivasam.com';
	var shareType = $("#selForm1 #class2").val();
	var dataUrl = $("#btnShareVivaclassNow").data('url');
	if (dataUrl === undefined || dataUrl === '') dataUrl = location.href;
	if (!dataUrl.startsWith('http')) dataUrl = 'http://v-sam.com/' + dataUrl;
	var params = '?';
	params += 'classSeq=' + $("#selForm1 #class1").val();
	params += '&url=' + dataUrl;
	params += '&linkage=V'; //연계서비스구분 - Q:샘퀴즈, W:워크시트, S:어휘지수, H:위첼, V:비바샘

	window.open(vivaclassHost + '/ourclass/'+shareType+'/ext/write' + params);
}

function googleClassroomShare(dataUrl) {
	// 로그인 체크
	if (SessionUtils.isLogin(location.href)) {
		// 교사인증 체크
		SessionUtils.confirmValidMember(function (valid) {
			if (valid) {
				if (dataUrl === undefined || dataUrl === '') dataUrl = location.href;
				if (!dataUrl.startsWith('http')) dataUrl = 'http://v-sam.com/' + dataUrl;
				window.open('https://classroom.google.com/share?url=' + dataUrl, 'googleClassroomSharePopup', 'width=540, height=580');
			}
		});
	}
}

// CDN error 발생 시 도메인 변경 (dn->dn22)
function contentErrorListener() {
	let cdnDomain = window.globals.config.cdnDomain;
	let cdnDomain22 = window.globals.config.cdnDomain22;

	// video 태그
	document.querySelectorAll('video').forEach(function(videoTag) {
		videoTag.addEventListener('error', function(event) {
			let src = event.target.src;
			if (src.includes(cdnDomain)) {
				event.target.src = src.replace(cdnDomain, cdnDomain22);
				this.load();
			}
		}, true);
	});

	// image 태그 (차시창 썸네일은 period.js에서 별도로 처리)
	document.querySelectorAll('img').forEach(function(imgTag) {
		imgTag.addEventListener('error', function(event) {
			let src = event.target.src;
			if (src.includes(cdnDomain)) {
				this.src = src.replace(cdnDomain, cdnDomain22);
			}
		}, true);
	});
	

}


function IeDownloadFile(url, filename) {
	try {
		fetch(url)
			.then(response => response.blob())
			.then(blob => {
				var a = document.createElement('a');
				var url = window.URL.createObjectURL(blob);
				a.href = url;
				a.download = filename;
				document.body.appendChild(a);
				a.click();
				setTimeout(() => {
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);
				}, 0);
			})
			.catch(() => alert('File download failed.'));
	} catch(e) {
		// 문제 생기면 기존 다운로드 로직으로 처리
		var a = document.createElement("a"); // a 태그 create
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		sleep(300);
		document.body.removeChild(a);
	}
}

/* 플로팅 배너 _ 오늘 하루 보지 않기 */
function todayClose() {
	$.cookie('topbanner', true, {expires: 1, path: '/'});
	$("#floatBanner").hide();
}

function getLauncherMemberAuthInfo(callback) {
	// 런처 접근 가능 사용자인지 체크
	Ajax.execute({
		url: '/vivaclassLauncher/launcherMemberAuthInfo',
		type: 'get',
		async : false,
		success: function(data) {
			var authYn;
			if (data.code === 'SUCCESS' && data.response === 'Y') {
				authYn = 'Y';
			} else {
				authYn = 'N';
			}

			callback(authYn);
		}
	})
}

function searchLauncherEducourseInfo(textbookCd) {
	let result = null;
	// 런처 교과서 조회
	Ajax.execute({
		url: '/vivaclassLauncher/api/lesson/textbookInfo',
		type: 'get',
		async : false,
		data: {textbook : textbookCd},
		success: function(data) {
			if (data.response != null) {
				result = data.response;
			}
		}
	});

	return result;
}

function vivaclassInfo() {
	let result = null;
	// 비바클래스 목록 가져오기
	Ajax.execute({
		url: '/vivaclass/classListOnProgress',
		type: 'get',
		async : false,
		success: function(data) {
			let classlist = data.response;

			if (!classlist) {
				alert('일시적으로 비바클래스 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.');
				return;
			} else {
				result = classlist;
			}
		}
	});

	return result;
}

function checkLauncherApproach(curItem){
	// 251개편 관련. 런처 오픈후 alert문 및 return 삭제
	// getLauncherMemberAuthInfo(function (data) {
	// 	if (data === 'N' && window.globals.config.activeEnv.indexOf('prod') > -1) {
	// 		alert("준비 중입니다.");
	// 		return;
	// 	}

		// 로그인 체크
		if (SessionUtils.isLogin(location.href)) {
			// 교사인증 체크
			SessionUtils.confirmValidMember(function (valid) {
				if (valid) {
					// 현재 선택한 과목, 학년  교과
					var textbookCd = curItem.data('textbookCd');
					var launcherInfo = searchLauncherEducourseInfo(textbookCd);
					var vivaclassInfos = vivaclassInfo();
					var vivaclassHost = (window.globals.config.activeEnv.indexOf('prod') > -1) ? 'https://vivaclass.vivasam.com' : 'https://dev-vivaclass.vivasam.com';
					var vivaclassLcHost = (window.globals.config.activeEnv.indexOf('prod') > -1) ? 'https://vivaclass-lc.vivasam.com' : 'https://s-vivaclass-lc.vivasam.com';

					let url = "";
					let urlLite = "";
					if (launcherInfo != null) {
						let launcherCheck = launcherInfo.grade.substring(launcherInfo.grade.length-1,launcherInfo.grade.length) + launcherInfo.labCourseVc;
						vivaclassInfos = $.grep(vivaclassInfos, function(classItem) {
							// 초등 클래스만, 활동, 교사 클래스는 수업 지원 불가 처리
							return classItem.schTypeCode === 'ES'
								&& !(classItem.clsTypeCode === '3' || classItem.clsTypeCode === '4') && classItem.state === '1';
						});
						if (vivaclassInfos.length > 0) {
							for (let x = 0; x < vivaclassInfos.length; x++) {
								if ((launcherCheck === vivaclassInfos[x].schYear + vivaclassInfos[x].schCourse) // 전담+동일학년+동일교과
									|| (vivaclassInfos[x].clsTypeCode === '1'
										&& launcherInfo.grade.substring(launcherInfo.grade.length-1,launcherInfo.grade.length) === vivaclassInfos[x].schYear) // 담임+동일학년
								){
									url = vivaclassLcHost + "?type=3&curriBook=" + textbookCd;
									break;
								} else if (vivaclassInfos[x].schTypeCode === 'ES' && vivaclassInfos[x].clsTypeCode === '5') {
									urlLite = vivaclassLcHost  + "?type=3&curriBook=" + textbookCd;
								}
							}
						}
					}

					if (url === '' && urlLite === '') {
						$("#vcNoClassAlert #makeClassNow").attr("href", vivaclassHost + "?classMakePop=Y");
						$("#vcNoClassAlert").addClass("on");
					} else if (url !== '') {
						window.open(url, 'vcLcPopup');
					} else {
						window.open(urlLite, 'vcLcPopup');
					}
				}
			});
		}
	// });
}

function goVivaclassLauncher() {
	if (!isClassListOnProgress) {
		$("#alert").addClass('on');
		return;
	}

	gtag('event', '비바런', {
		'내_수업함': '비바클래스 수업하기 배너',
		'send_to': 'G-SQPSJHDHZM'
	});
	// getLauncherMemberAuthInfo(function (data) {
	// 	if (data === 'N' && window.globals.config.activeEnv.indexOf('prod') > -1) {
	// 		alert("준비 중입니다.");
	// 		return;
	// 	}
		var vivaclassLcHost = (window.globals.config.activeEnv.indexOf('prod') > -1) ? 'https://vivaclass-lc.vivasam.com' : 'https://s-vivaclass-lc.vivasam.com';
		window.open(vivaclassLcHost, 'vcLcPopup');
	// });
}

/**
 * 썸네일 실물파일 없어서 엑박 뜨게 하는 대신 대체 클래스 추가
 * 외부링크: external, 수업자료: commonThumb
 * @param object
 */
function classAppend(object) {
	if (object !== undefined) {
		var aChasiThumb = $(object).parent('a.chasi_thumb');
		if (aChasiThumb.data('filetype') === 'S') {
			aChasiThumb.addClass('external');
		} else {
			aChasiThumb.addClass('commonThumb');
		}

		// CDN error 발생 시 도메인 변경 (dn->dn22)
		var src = object.src;
		if(src.includes(window.globals.config.cdnDomain)) {
			object.src = src.replace(window.globals.config.cdnDomain, window.globals.config.cdnDomain22);
		} else if(src.includes(window.globals.config.cdnDomain22)) {
			// 22개정 컨텐츠는 통과
		} else {
			$(object).remove();
		}
	}
}
