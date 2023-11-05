/* --------------------------------------------------
script.js
サイト全体で読み込まれるJS
-------------------------------------------------- */

// jquery 競合対策
const jQueryLatest = jQuery.noConflict(false)
;(function ($) {
  /* ------------------------------
  ここからmakeshop独自スクリプト
  ------------------------------ */

  var scrollpos = 0

  $('.humberger').on('click', function () {
    if (!$('body').hasClass('fixed')) {
      scrollpos = $(window).scrollTop()
      $('body').addClass('fixed').css({ top: -scrollpos })
      $('body').addClass('drawer-opened')
      $('.button-menu').addClass('button-menu-opened')
    } else {
      $('body').removeClass('fixed').css({ top: 0 })
      window.scrollTo(0, scrollpos)
      $('body').removeClass('drawer-opened')
      $('.button-menu').removeClass('button-menu-opened')
    }
  })

  $('.navbar-list-parent').hover(
    function () {
      $(this).children('.navbar-sub').fadeIn('fast')
    },
    function () {
      $(this).children('.navbar-sub').fadeOut('fast')
    }
  )

  $('.search-keyword').on('keypress', function (e) {
    if (e.keyCode == 13) {
      var index = $('.search-keyword').index(this)
      $('.search-url')[index].click()
    }
  })

  /* ------------------------------
  ここまでmakeshop独自スクリプト
  ------------------------------ */

  /////////////////////////////////////////////////////////
  // 定数
  /////////////////////////////////////////////////////////

  // スクロール処理の実行タイミング（ms）
  const SCROLL_THRESHOLD = 300

  // リサイズ処理の実行タイミング（ms）
  const RESIZE_THRESHOLD = 300

  /////////////////////////////////////////////////////////
  // 変数
  /////////////////////////////////////////////////////////

  // サンプル変数
  let isData = 0

  /////////////////////////////////////////////////////////
  // EVENT HOOK
  /////////////////////////////////////////////////////////

  /**
   * コンストラクタ
   *
   * @return {boolean} false
   */
  const init = function () {
    isData = 1
  }

  /**
   * トップページのキービジュアルの高さ調整
   *
   * @return none
   */
  const initTopKeyVisualHeight = function () {
    // トップページで無ければ、なにもしない
    if (!$('body#page_index').length) {
      return false
    }

    // ウィンドウ幅と高さの取得
    win_w = window.innerWidth
    win_h = window.innerHeight

    // ヘッダの高さを取得
    hedder_h = $('header').innerHeight()

    if (win_w > 834) {
      // PCのとき

      // メインビジュアルの高さを画面いっぱいにする
      $('.para-mainVisual .swiper-slide > span').height(win_h - hedder_h)
    } else {
      // SPのとき
      $('.para-mainVisual .swiper-slide > span').height(0)
    }
  }

  /**
   * トップメインビジュアルのローディング処理
   *
   * @return {boolean} false
   */
  const loadMainVisual = function () {
    console.log('loadMainVisual is called!!')

    // トップページ以外ならなにもしない
    if (!$('body#page_index').length) {
      return false
    }

    // [テスト用] パラメータが無ければなにもしない
    let s = window.location.search
    if (s.indexOf('check=INNNER_FUGETSU-13') == -1) {
      return false
    }
    console.log('パラメータあり')

    // コンテンツをいったん非表示にする
    $('main > section').css('opacity', '0')

    // メインビジュアルの高さをセットする。
    initTopKeyVisualHeight()

    // メインビジュアルを、コールバックを設定してから、読み込み開始
    let $img = $('.loadimage')
    let $img_originalSrc = $('.loadimage').attr('src')
    $img.attr('src', '')

    $img.on('load', function () {
      console.log('読み込み完了')
      $('main > section').css('opacity', '1')
    })

    console.log('読み込み開始')
    $img.attr('src', $img_originalSrc)
  }
  loadMainVisual()

  /**
   * コンテンツロードイベント
   * 画像、動画などの関連データの全ての読み込み後、実行する処理はここに記述する
   *
   * @return {boolean} false
   */
  const contentLoaded = function () {
    $(window).on('load', function () {
      initSuruSuruScroll()
      initEx1SuruSuruScroll()
      initAcc()
      initAccForSp()
      initHeader()

      // makeshopのみ
      initSwiper()
      initCustomScroll()
      initCustomScroll02()
      initSwiperItemDetail()
      initDetailsRecommend()
      initNumInputOperator()
      initUserGuidePage()
      initGiftPage()
    })
  }

  /**
   * スクロールイベント
   * スクロールを監視して呼び出す処理はここに記述する
   *
   * @return {boolean} false
   */
  const watchScroll = function () {
    let timerId = null
    $(window).on('load scroll', function () {
      // 間引き処理
      clearTimeout(timerId)
      timerId = setTimeout(function () {
        // ここに処理を記述

        // トップへ戻るボタン表示/非表示
        toggleTotop()

        // トップページでスクロールしたらスクロールアイコンを非表示にする
        hideScrollIcon()
      }, SCROLL_THRESHOLD)
    })
  }

  /**
   * リサイズイベント
   * リサイズを監視して呼び出す処理はここに記述する
   *
   * @return {boolean} false
   */
  const watchResize = function () {
    let timerId = null
    $(window).on('load resize', function () {
      // 間引き処理
      clearTimeout(timerId)
      timerId = setTimeout(function () {
        // ここに処理を記述
        initHeaderPadding()

        initTopKeyVisualHeight()

        // テーブルのオーバーフロー監視
        watchOverflow()
      }, RESIZE_THRESHOLD)
    })
  }

  // 初期化
  init()

  // コンテンツロードイベントをセット
  contentLoaded()

  // スクロールイベントをセット
  watchScroll()

  // リサイズイベントをセット
  watchResize()

  /////////////////////////////////////////////////////////
  // FUNCTION
  /////////////////////////////////////////////////////////

  /**
   * トップへ戻るボタン表示/非表示
   * 現在のスクロール量が、一定以上だったら、トップへ戻るボタンを表示/非表示する
   * スクロールイベントで呼び出し
   *
   * @return {boolean} false
   */
  const toggleTotop = function () {
    // 発火するスクロール量
    const startPos = 100

    if ($(window).scrollTop() > startPos) {
      $('body').attr('data-showTotopBtn', 'true')
    } else {
      $('body').attr('data-showTotopBtn', 'false')
    }
  }

  /**
   * するするスクロール初期化
   * すべてのページ内アンカーリンクを、するするスクロールにする
   *
   * @return {boolean} false
   */
  const initSuruSuruScroll = function () {
    // href="#xxx"を押したときの処理実装
    $('a[href^="#"]').on('click', function () {
      const margin = 20
      const speed = 500
      const href = $(this).attr('href')
      const target = $(href == '#' ? 'html' : href)
      const position = target.offset().top
      $('html, body').animate({ scrollTop: position - margin }, speed, 'swing')
      return false
    })
  }

  /**
   * アコーディオン
   * data-js="acc"の要素にアコーディオン処理を実装する。
   *
   * @return {boolean} false
   */
  const initAcc = function () {
    // config
    const SPEED = 300 // アニメーションの速度

    // 親エレメントの取得
    let $parents = $('[js-acc]')

    $parents.each(function () {
      // 現在処理中の親要素の格納
      let $current = $(this)

      // 親エレメント下にあるトリガー要素とコンテンツ要素を取得
      let $trigger = $current.find($current.attr('js-acc-trigger'))
      let $content = $current.find($current.attr('js-acc-content'))

      // 初期状態（js-acc-state）がcloseのとき、コンテンツを隠す
      if ($current.attr('js-acc-state') === 'close') {
        $content.hide()
      }

      // イベントによる分岐
      if ($current.attr('js-acc-event') === 'hover') {
        $current.hover(
          function () {
            // 【追加仕様】自分がアクティブで無ければ、アクティブに「-gray」クラス追加
            if (!$current.hasClass('-active')) {
              $current.closest('ul').find('.-active').addClass('-gray')
            }

            // js-acc-bggrayがあったら、bodyに「-grayout」クラスを付与する
            if ($current.attr('js-acc-bggray')) {
              $('body').addClass('-grayout')
            }

            // close -> open
            $current.attr('js-acc-state', 'opening')
            $content.stop().slideDown(SPEED, function () {
              $current.attr('js-acc-state', 'open')
            })
          },
          function () {
            // 【追加仕様】自分がアクティブで無ければ、アクティブから「-gray」クラス削除
            $current.closest('ul').find('.-active').removeClass('-gray')

            // js-acc-bggrayがあったら、bodyから「-grayout」クラスを削除する
            if ($current.attr('js-acc-bggray')) {
              $('body').removeClass('-grayout')
            }

            // open -> close
            $current.attr('js-acc-state', 'closing')
            $content.stop().slideUp(SPEED, function () {
              $current.attr('js-acc-state', 'close')
            })
          }
        )
      } else {
        // トリガーをクリックで、data-acc-stateを変更する。
        $trigger.on('click', function (e) {
          e.preventDefault()

          // 状態による分岐
          if ($current.attr('js-acc-state') === 'opening' || $current.attr('data-acc-state') === 'closing') {
            // アニメーション中だったら、なにもしない
            return false
          } else if ($current.attr('js-acc-state') === 'close') {
            // close -> open
            $current.attr('js-acc-state', 'opening')
            $content.slideDown(SPEED, function () {
              $current.attr('js-acc-state', 'open')
            })
          } else {
            // open -> close
            $current.attr('js-acc-state', 'closing')
            $content.slideUp(SPEED, function () {
              $current.attr('js-acc-state', 'close')
            })

            // $currentにjs-acc-collapse="true"があったら、子アコーディオンも閉じる
            if ($current.attr('js-acc-collapse') === 'true') {
              $current
                .find('[js-acc][js-acc-state="open"]')
                .attr('js-acc-state', 'close')
                .each(function () {
                  $(this).find($(this).attr('js-acc-content')).hide()
                })
            }
          }
        })
      }
    })
  }

  /**
   * アコーディオン（SP）
   * js-accForSpの要素にアコーディオン処理を実装する。
   *
   * @return {boolean} false
   */
  const initAccForSp = function () {
    // config
    const SPEED = 300 // アニメーションの速度

    // 親エレメントの取得
    let $parents = $('[js-accForSp]')

    $parents.each(function () {
      // 現在処理中の親要素の格納
      let $current = $(this)

      // 親エレメント下にあるトリガー要素とコンテンツ要素を取得
      let $trigger = $current.find($current.attr('js-acc-trigger'))
      let $content = $current.find($current.attr('js-acc-content'))

      // pcサイズだったら、初期設定時にjs-acc-state="open"にする
      if ($('body').innerWidth() > 834) {
        $current.attr('js-acc-state', 'open')
      }

      // 初期状態（js-acc-state）がcloseのとき、コンテンツを隠す
      if ($current.attr('js-acc-state') === 'close') {
        $content.hide()
      }

      // イベントによる分岐
      if ($current.attr('js-acc-event') === 'hover') {
        $current.hover(
          function () {
            // close -> open
            $current.attr('js-acc-state', 'opening')
            $content.stop().slideDown(SPEED, function () {
              $current.attr('js-acc-state', 'open')
            })
          },
          function () {
            // open -> close
            $current.attr('js-acc-state', 'closing')
            $content.stop().slideUp(SPEED, function () {
              $current.attr('js-acc-state', 'close')
            })
          }
        )
      } else {
        // トリガーをクリックで、data-acc-stateを変更する。
        $trigger.on('click', function (e) {
          e.preventDefault()

          // 状態による分岐
          if ($current.attr('js-acc-state') === 'opening' || $current.attr('data-acc-state') === 'closing') {
            // アニメーション中だったら、なにもしない
            return false
          } else if ($current.attr('js-acc-state') === 'close') {
            // close -> open
            $current.attr('js-acc-state', 'opening')
            $content.slideDown(SPEED, function () {
              $current.attr('js-acc-state', 'open')
            })
          } else {
            // open -> close
            $current.attr('js-acc-state', 'closing')
            $content.slideUp(SPEED, function () {
              $current.attr('js-acc-state', 'close')
            })

            // $currentにjs-acc-collapse="true"があったら、子アコーディオンも閉じる
            if ($current.attr('js-acc-collapse') === 'true') {
              $current
                .find('[js-acc][js-acc-state="open"]')
                .attr('js-acc-state', 'close')
                .each(function () {
                  $(this).find($(this).attr('js-acc-content')).hide()
                })
            }
          }
        })
      }

      // リサイズ時、ウィンドウサイズがPCサイズになったら、強制的にOpenにする
      $(window).on('resize', function () {
        if ($('body').innerWidth() > 834) {
          if ($current.attr('js-acc-state') === 'close') {
            // close -> open
            $current.attr('js-acc-state', 'open')
            $content.stop().show()
          }
        } else {
          if ($current.attr('js-acc-state') === 'open') {
            // open -> close
            $current.attr('js-acc-state', 'close')
            $content.stop().hide()
          }
        }
      })
    })
  }

  /**
   * テーブルのオーバーフロー監視
   * data-js="watchOverflow"の要素下で、テーブルがoverflowしているかどうかを監視する。
   * リサイズイベントで呼び出し
   *
   * @return {boolean} false
   */
  const watchOverflow = function () {
    $('[js-watchOverflow]').each(function () {
      // アウター幅取得
      const elOuterWidth = $(this).find('.inner').eq(0).innerWidth()

      // インナー幅（テーブルの幅）取得
      const elInnerWidth = $(this).find('table').eq(0).outerWidth()

      if (elOuterWidth < elInnerWidth) {
        $(this).attr('data-isOverflow', 'true')
      } else {
        $(this).removeAttr('data-isOverflow')
      }
    })
  }

  /**
   * ヘッダ（スマホ）のドロワーメニュー初期化処理
   *
   * @return none
   */
  const initHeader = function () {
    // ドロワー開く処理付与
    $('#btnHeaderDrawerOpen').on('click', function () {
      $('#headerForSp').attr('stOpen', 'open')
    })

    // ドロワー閉じる処理付与
    $('#btnHeaderDrawerClose, #headerForSp > .bg').on('click', function () {
      $('#headerForSp').attr('stOpen', 'close')
    })
  }

  /**
   * ヘッダの高さ計算処理
   *
   * @return none
   */
  const initHeaderPadding = function () {
    // ヘッダーの高さを取得
    let h = $('header').innerHeight()

    // 余白設定
    $('main').css('paddingTop', h)

    // PC用プルダウンメニューのmax-height調整
    $('.header-forPc>.mainMenu>ul>li>.content').css('max-height', $('body').innerHeight() - h + 'px')
  }

  /**
   * トップページのメインビジュアル初期化
   *
   * @return none
   */
  const initSwiper = function () {
    const swiper = new Swiper('#swiper01', {
      autoplay: {
        delay: 7000,
      },
      effect: 'fade',
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next', // 「次へ」ボタン要素のクラス
        prevEl: '.swiper-button-prev', // 「前へ」ボタン要素のクラス
      },
    })
  }

  /**
   * トップページのカスタムスクロール処理
   *
   * @return none
   */
  const initCustomScroll = function () {
    const swiper = new Swiper('#swiperFeature', {
      slidesPerView: 1,
      spaceBetween: 30,
      centeredSlides: false,
      loop: false,
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
      },
      // freeMode: {
      //   enabled: true,
      //   sticky: true,
      // },
      freeMode: false,
      breakpoints: {
        769: {
          slidesPerView: 3,
          freeMode: {
            enabled: false,
            sticky: true,
          },
        },
      },
    })
  }
  const initCustomScroll02 = function () {
    const swiper = new Swiper('#swiperRecommend', {
      slidesPerView: 1,
      spaceBetween: 15,
      centeredSlides: false,
      loop: false,
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
      },
      freeMode: false,
      breakpoints: {
        769: {
          slidesPerView: 4,
          freeMode: {
            enabled: false,
            sticky: true,
          },
        },
      },
    })
  }

  /**
   * トップページのメインビジュアル初期化
   *
   * @return none
   */
  const initSwiperItemDetail = function () {
    const swiper = new Swiper('#swiper02', {
      effect: 'fade',
      navigation: {
        nextEl: '.swiper-item__btn02', //「次へ」ボタンの要素のセレクタ
        prevEl: '.swiper-item__btn01', //「前へ」ボタンの要素のセレクタ
      },
    })

    const swiperThumbs = new Swiper('#swiper03', {
      slidesPerView: swiper.length,
    })

    $('#swiper03').on('click', '.swiper-slide', function () {
      // クリックされたサムネイルの順番を取得
      let slideIndex = $('#swiper03 .swiper-slide').index(this)
      // 引数に指定したスライドに移動させる slideTo というメソッドを使って移動させる。loopの設定をしている場合は slideToLoop を使う
      swiper.slideToLoop(slideIndex)
    })
  }
  const initDetailsRecommend = function () {
    const swiper = new Swiper('#detailsRecommend', {
      slidesPerView: 2,
      spaceBetween: 15,
      autoplay: {
        delay: 3500,
      },
      centeredSlides: false,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        type: 'bullets',
      },
      freeMode: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        769: {
          slidesPerView: 4,
          freeMode: {
            enabled: false,
            sticky: true,
          },
        },
      },
    })
  }
  /**
   * カートページの数量inputタグ操作
   *
   * @return none
   */

  const initNumInputOperator = function () {
    var cMasterAttr = 'data-js-num-operator'

    var cInputAttr = 'data-js-num-operator__input'
    var vUp = $('[data-js-num-operator__up]')
    var vDown = $('[data-js-num-operator__down]')
    $(vUp).click(function () {
      var vInput = $(this)
        .closest('[' + cMasterAttr + ']')
        .find($('[' + cInputAttr + ']'))
      $(vInput).val(Number($(vInput).val()) + 1)
    })
    $(vDown).click(function () {
      var vInput = $(this)
        .closest('[' + cMasterAttr + ']')
        .find($('[' + cInputAttr + ']'))
      $(vInput).val(Number($(vInput).val()) - 1)
    })

    // レコメンドのカートに入れるボタンの処理
    $('[data-js-onclick-submit]').on('click', function () {
      $(this).closest('form').submit()
    })
  }
  /**
   * するするスクロール初期化
   * すべてのページ内アンカーリンクを、するするスクロールにする
   * 追従ヘッダ高さを考慮した処理含む
   * @return {boolean} false
   */
  const initEx1SuruSuruScroll = function () {
    // href="#xxx"を押したときの処理実装
    var clink = 'data-js-in-page-link-link'
    var vlink = $('[' + clink + ']')
    $(vlink).on('click', function () {
      // const margin = 20;
      const margin = $('header').height()
      const speed = 500
      const href = $(this).attr(clink)
      const target = $(href == '#' ? 'html' : $('[' + 'data-js-in-page-link-hl' + '=' + href + ']'))
      const position = target.offset().top
      $('html, body').animate({ scrollTop: position - margin }, speed, 'swing')
      return false
    })
  }

  /**
   * ご利用ガイドページで、ハッシュがついているときスクロールする
   * @return {boolean} false
   */
  const initUserGuidePage = function () {
    if (!$('body#viewPageOnlineshoppingIndex').length) {
      return false
    }

    // #の取得
    let hash = window.location.hash

    // 要素があったら、移動する
    if ($(hash).length) {
      let y_pos = $(hash).offset().top
      $('html, body').animate({ scrollTop: y_pos }, 500, 'swing')
    }
  }

  /**
   * 父の日ページ、価格で選ぶのタブ切り替え処理の初期化
   * @return {boolean} false
   */
  const initGiftPage = function () {
    // 該当ページで無ければなにもしない
    if (!$('body#viewPageGift').length) {
      return false
    }

    // 親エレメントの取得
    let $root = $('[data-js-tab]')

    // トリガーの取得
    let $triggers = $root.find('.tabMenu > ul > li > a')

    // クリック時の処理追加
    $triggers.on('click', function (e) {
      e.preventDefault()

      // activeだったらなにもしない
      if ($(this).closest('li').hasClass('-active')) {
        return false
      }

      // -activeの削除
      $root.find('.-active').removeClass('-active')

      // tabMenuに-active付与
      $(this).closest('li').addClass('-active')

      // tabContentに-active付与
      $root.find('#' + $(this).attr('data-js-tab-target')).addClass('-active')
    })
  }

  /**
   * トップページでスクロールしたらスクロールアイコンを非表示にする
   *
   * @return none
   */
  const hideScrollIcon = function () {
    // トップページ以外ならなにもしない
    if (!$('body#page_index').length) {
      return false
    }

    // スクロールの位置が0以外なら、
    if ($(window).scrollTop() > 0) {
      $('body').addClass('-hideScrollIcon')
    } else {
      $('body').removeClass('-hideScrollIcon')
    }
  }
})(jQueryLatest)
