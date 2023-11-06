let imagesItems = [...document.querySelectorAll('.img-wrap')]
let titles = [...document.querySelectorAll('h2')]
let titleMessage = document.querySelector('.title')

let setItemActive = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active')
    } else {
      entry.target.classList.remove('active')
    }
  })
}

let options = {
  rootMargin: '0px',
  threshold: 0.2,
}

let observer = new IntersectionObserver(setItemActive, options)

observer.observe(titleMessage)

// img-wrapは偶数と奇数で出現する場所が違う
imagesItems.map((item, index) => {
  item.children[0].style.backgroundImage = `url(./images/${index + 1}.jpg)`
  index % 2 == 0 ? (item.style.left = '55%') : (item.style.left = '5%')
  observer.observe(item)
})

titles.map((title, index) => {
  index % 2 == 0 ? (title.style.left = '45%') : (title.style.left = '35%')
  observer.observe(title)
})

/**
 * マウスオーバーした時の処理
 */
const handleMouseover = (e) => {
  // アコーディオンのラッパーを取得
  const accWrapper = e.currentTarget.querySelector('.accordion-container-inner')

  // 表示するアコーディオン要素の高さを取得
  const accHeight = accWrapper.children[0].offsetHeight

  // アコーディオンのラッパー（高さ0px）に内側に要素の高さを設定
  accWrapper.style.height = `${accHeight}px`
  accWrapper.classList.add('active')
}

/**
 * マウスアウトした時の処理
 */
const handleMouseout = function (e) {
  // アコーディオンのラッパーを取得
  const accWrapper = e.currentTarget.querySelector('.accordion-container-inner')

  accWrapper.style.height = '0px'
  accWrapper.classList.remove('.active')
  e.currentTarget.classList.remove('active')
}

/**
 * ヘッダーメニューのアコーディオンPC
 */
function initHeaderAccordion(bool) {
  // ホバーターゲット取得
  const hoverTargets = document.querySelectorAll('.link-item-container')

  hoverTargets.forEach((hoverTarget) => {
    if (bool) {
      console.log('PCのアコーディオン追加')
      // ターゲット要素のマウスオーバーを監視
      hoverTarget.addEventListener('mouseenter', handleMouseover)
      // ターゲット要素からのマウスアウトを監視
      hoverTarget.addEventListener('mouseleave', handleMouseout)
    } else {
      console.log('PCのアコーディオン削除')
      hoverTarget.removeEventListener('mouseenter', handleMouseover)
      hoverTarget.removeEventListener('mouseleave', handleMouseout)
    }
  })
}

/**
 * クリックした時の処理
 */
const handleClick = function (e) {
  e.preventDefault()

  const target = e.currentTarget

  if (target.classList.contains('active')) {
    target.classList.remove('active')

    // アコーディオンのラッパーを取得
    const accWrapper = e.currentTarget.querySelector('.accordion-container-inner')

    accWrapper.style.height = '0px'
  } else {
    target.classList.add('active')

    // アコーディオンのラッパーを取得
    const accWrapper = e.currentTarget.querySelector('.accordion-container-inner')

    // 表示するアコーディオン要素の高さを取得
    const accHeight = accWrapper.children[0].offsetHeight

    // アコーディオンのラッパー（高さ0px）に内側に要素の高さを設定
    accWrapper.style.height = `${accHeight}px`
  }
}

/**
 * ヘッダーメニューのアコーディオンSP
 */
function initSpHeaderAccordion(bool) {
  // クリックターゲット取得
  const hoverTargets = document.querySelectorAll('.link-item-container')

  hoverTargets.forEach((hoverTarget) => {
    if (bool) {
      console.log('スマホのアコーディオン追加')
      // ターゲット要素のクリックを監視
      hoverTarget.addEventListener('click', handleClick)
    } else {
      console.log('スマホのアコーディオン削除')
      hoverTarget.removeEventListener('click', handleClick)
    }
  })
}

/**
 * メディアクエリ
 */
const initMediaQuery = function () {
  const mediaQuery = window.matchMedia('(max-width: 768px)')

  const handleWindowResize = (e) => {
    if (e.matches) {
      initSpHeaderAccordion(true)
      initHeaderAccordion(false)
    } else {
      initHeaderAccordion(true)
      initSpHeaderAccordion(false)
    }
  }

  handleWindowResize(mediaQuery)

  mediaQuery.addEventListener('change', handleWindowResize)
}
initMediaQuery()

/**
 * ヘッダーのサブカテゴリ表示ボタン
 */
const initCategoryButton = function () {
  const buttons = document.querySelectorAll('.button')

  const handleButtonClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // 一度全てのボタンのselectedクラスを削除
    buttons.forEach((button) => {
      button.classList.remove('selected')
    })
    // クリックしたボタンにselectedクラスを付与
    e.currentTarget.classList.add('selected')

    // ボタンに対応する要素にactiveクラスを付与しし例外はクラスを外す
    const contents = document.querySelectorAll('.js-shop-links')
    contents.forEach((content) => {
      if (content.dataset.category === e.target.dataset.category) {
        content.classList.add('active')
      } else {
        content.classList.remove('active')
      }
    })
    // アコーディオンのラッパーを取得
    const accWrapper = document.querySelector('#shop-accordion')

    // 表示するアコーディオン要素の高さを取得
    const accHeight = accWrapper.children[0].offsetHeight

    // アコーディオンのラッパー（高さ0px）に内側に要素の高さを設定
    accWrapper.style.height = `${accHeight}px`
  }

  buttons.forEach((button) => {
    button.addEventListener('click', handleButtonClick)
  })
}
initCategoryButton()

/**
 * Windowのresizeを監視
 */
const listenWindowResize = function () {
  const targets = document.querySelectorAll('.link-item-container')

  const handleResize = () => {
    targets.forEach((target) => {
      target.querySelector('.accordion-container-inner').style.height = '0px'
      target.classList.remove('active')
    })
  }

  window.addEventListener('resize', handleResize)
}
listenWindowResize()

/**
 * ハンバーガーメニューのクリック
 */
const initHamburger = function () {
  const target = document.querySelector('.hamburger')

  target.addEventListener('click', (e) => {
    e.currentTarget.classList.toggle('active')
    document.body.classList.toggle('active')
    document.querySelector('.header-inner').classList.toggle('active')
  })
}
initHamburger()
