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
 * メディアクエリ
 */
const initMediaQuery = function () {
  const mediaQuery = window.matchMedia('(max-width: 768px)')

  const handleWindowResize = (e) => {
    if (e.matches) {
      initSpHeaderAccordion()
    } else {
      initHeaderAccordion()
    }
  }

  handleWindowResize(mediaQuery)

  mediaQuery.addEventListener('change', handleWindowResize)
}
initMediaQuery()

/**
 * ヘッダーメニューのアコーディオンPC
 */
const initHeaderAccordion = function () {
  // ホバーターゲット取得
  const hoverTargets = document.querySelectorAll('.link-item-container')

  // マウスオーバーした時の処理
  handleMouseover = (e) => {
    // アコーディオンのラッパーを取得
    const accWrapper = e.currentTarget.querySelector('.accordion-container-inner')

    // 表示するアコーディオン要素の高さを取得
    const accHeight = accWrapper.children[0].offsetHeight

    // アコーディオンのラッパー（高さ0px）に内側に要素の高さを設定
    accWrapper.style.height = `${accHeight}px`
  }

  // マウスアウトした時の処理
  handleMouseout = (e) => {
    // アコーディオンのラッパーを取得
    const accWrapper = e.currentTarget.querySelector('.accordion-container-inner')

    accWrapper.style.height = '0px'
  }

  hoverTargets.forEach((hoverTarget) => {
    // ターゲット要素のマウスオーバーを監視
    hoverTarget.addEventListener('mouseenter', handleMouseover)
    // ターゲット要素からのマウスアウトを監視
    hoverTarget.addEventListener('mouseleave', handleMouseout)
  })
}

/**
 * ヘッダーメニューのアコーディオンSP
 */
function initSpHeaderAccordion() {
  // クリックターゲット取得
  const hoverTargets = document.querySelectorAll('.link-item-container')

  // クリックした時の処理
  const handleClick = (e) => {
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

  hoverTargets.forEach((hoverTarget) => {
    // ターゲット要素のクリックを監視
    hoverTarget.addEventListener('click', handleClick)
    console.log('クリック')
  })
}

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
