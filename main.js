const cards = [].slice.call(document.querySelectorAll('.card'));
const backCards = [].slice.call(document.querySelectorAll('.back-card'));
const titles = [].slice.call(document.querySelectorAll(".description__title"));
const texts = [].slice.call(document.querySelectorAll(".description__text"));


var fromTo = (from, to, prgrs = 0) => from + (to - from) * prgrs;

var easing = {
  inCubic: function(t, b, c, d) { // t: current time, b: begInnIng value, c: change In value, d: duration
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (1.7 * tc * ts - 2.05 * ts * ts + 1.5 * tc - 0.2 * ts + 0.05 * t);
  }
};

var transforms = {
  translate3D: function(x = 0, y = 0, z = 0, el = "px") {
    return `translate3d(${x}${el}, ${y}${el}, ${z}${el})`;
  },

  rotate3d: function(x = 0, y = 0, z = 0, deg = 0) {
    return `rotate3d(${x}, ${y}, ${z}, ${deg}deg)`;
  },

  rotate: function(deg = 0) {
    return `rotate(${deg}deg)`;
  },

  scale: function(x = 0, y = 0) {
    return `scale(${x}, ${y})`;
  },

  perspective: function(val = 0, el = "px") {
    return `perspective(${val}${el})`;
  }
};

var descriptions = {
  index: 0,
  timeout: 550,
  titles: titles.slice(),
  texts: texts.slice(),

  animateDescription: function() {
    this.titles[0].classList.add("fadeout-up");
    this.titles[1].classList.add("fadein-up");
    this.texts[0].classList.add("fadeout-up");
    this.texts[1].classList.add("fadein-up");
  },

  swapDescription: function() {
    let shdC = this.titles.shift();
    let shdT = this.texts.shift();

    let count = titles.length;
    // if (count > this.index + 4) {
    //   this.titles.push(titles[this.index + 5]);
    //   this.texts.push(texts[this.index + 5]);
    // }
    // else {
      this.titles.push(shdC);
      this.texts.push(shdT);
    // }
    this.index === count ? this.index = 0 : this.index++;
    this.initDescriptions();
  },

  initDescriptions: function () {
    let length = this.titles.length;
    this.titles[0].classList.remove("hide", "fadein-up");
    this.titles[length - 1].classList.add("hide")
    this.titles[length - 1].classList.remove("fadeout-up");
    this.texts[0].classList.remove("hide", "fadein-up");
    this.texts[length - 1].classList.add("hide")
    this.texts[length - 1].classList.remove("fadeout-up");
  }
};


var curBlocks = {
  blocks: cards.slice(),
  backBlocks: backCards.slice(),
  index: 0,

  swapBlocks: function() {
    let shd = this.blocks.shift();
    let backShd = this.backBlocks.shift();
    let count = cards.length;
    // if (count > this.index +4) {
    //   this.blocks.push(cards[this.index +5]);
    //   this.backBlocks.push(backCards[this.index +5]);
    // }
    // else {
      this.blocks.push(shd);
      this.backBlocks.push(backShd);
    // }
    shd.classList.remove('current');
    backShd.classList.remove('current');
    this.index === count ? this.index = 0 : this.index++;
    initScene();
  }
};

var block = {
  width: 35,
  heigth: 30.6,
  b2scale: 32 / 35,
  upHeigth: 1,

  b2caclH: 0,

  interact: false
};

var initScene = function() {
  block.b2caclH =
  block.heigth * (1 - block.b2scale) * (1 / block.b2scale) / 2
  + block.upHeigth * (1 / block.b2scale);

  curBlocks.blocks[0].style.transform = transforms.translate3D(0, 0, 0, "rem");
  curBlocks.blocks[1].style.transform =
  transforms.scale(block.b2scale, block.b2scale)
  + transforms.translate3D(0, block.b2caclH, 0, "rem");

  curBlocks.blocks[0].style.opacity = 1;
  curBlocks.blocks[1].style.opacity = 0.1;

  curBlocks.blocks[0].className = "card current";
  curBlocks.blocks[1].className = "card next";
  curBlocks.backBlocks[0].className = "back-card current";
  // bindDrag();
};

initScene();

var drag = {
  degree: 2.4,
  upHeight: 1.7,
  maxDrag: 78,
  b2scale: 0.98,
  dx: 0,
  frameBusy: false,
  helloSafari: 2.8 // need to add this coz of strange behavior
};


var dragBlock = function() {
  const maxStep = drag.maxDrag;
  let curStep = drag.dx;
  if (curStep > maxStep) curStep = maxStep;
  if (curStep < -maxStep) curStep = -maxStep;

  let progress = curStep / maxStep;
  let curDeg = drag.degree * progress;
  let curUpLen = drag.upHeight * Math.abs(curStep) / maxStep;
  let curScaleBlock2 = drag.b2scale + (1 - drag.b2scale) * (maxStep - curStep) / maxStep;

  curBlocks.blocks[0].style.transform =
      transforms.perspective(220, "rem")
    + transforms.rotate(curDeg)
    + transforms.rotate3d(1, 1, 0, curDeg * 3)
    + transforms.translate3D(0, -curUpLen, 0, "rem");

  curBlocks.blocks[1].style.transform =
      transforms.scale(block.b2scale * curScaleBlock2, block.b2scale * curScaleBlock2)
    + transforms.translate3D(0, block.b2caclH - curUpLen / 4, 0, "rem")
    + transforms.rotate(curDeg / 3)
    + transforms.rotate3d(1, 1, 0, curDeg * drag.helloSafari);

  curBlocks.blocks[0].style.opacity = 1;
  curBlocks.blocks[1].style.opacity = fromTo(0.1, 0.7, progress);
  drag.frameBusy = false;
};

var throwing = {
  animating: false,
  curStep: 0,
  maxStep: 15
};

var throwBlock = function() {
  if (++throwing.curStep > throwing.maxStep) {
    // hammer.off("mousedown touchstart");
    throwing.curStep = 0;
    drag.dx = 0;
    curBlocks.swapBlocks();
    return;
  }
  //
  let progress = easing.inCubic(throwing.curStep, 0, 1, throwing.maxStep);
  let delta = easing.inCubic(throwing.curStep, 0, 1, throwing.maxStep) * 40;

  curBlocks.blocks[0].style.transform =
      transforms.rotate(drag.degree + delta / 2)
    + transforms.rotate3d(1, 1, 0, drag.degree * 3)
    + transforms.translate3D(delta, -drag.upHeight - delta / 1.2, 0, "rem");

  let b2Scale = fromTo(block.b2scale * drag.b2scale, 1, progress);
  let b2TransY = fromTo(block.b2caclH - drag.upHeight / 4, 0, progress);
  let b2Rot = fromTo(drag.degree / 3, 0, progress);

  curBlocks.blocks[1].style.transform =
      transforms.scale(b2Scale, b2Scale)
    + transforms.translate3D(0, b2TransY, 0, "rem")
    + transforms.rotate(b2Rot)
    + transforms.rotate3d(1, 1, 0, drag.degree * drag.helloSafari);

  curBlocks.blocks[0].style.opacity = fromTo(1, 0.5, progress);
  curBlocks.blocks[1].style.opacity = fromTo(0.7, 1, progress);

  requestAnimationFrame(throwBlock);
};

// function bindDrag() {
var touchZone = document.querySelector('.front')
var hammer = new Hammer(touchZone);
hammer.on('panmove', function(e){
  block.interact = true;
  if (e.deltaX <= 0) e.deltaX = 0;
  if (e.deltaY >= 0) e.deltaY = 0;
  drag.dx = Math.sqrt(Math.pow(e.deltaX, 2) + Math.pow(e.deltaY, 2));
  if (!drag.dx) return;
  if (drag.frameBusy) return;
  drag.frameBusy = true;
  requestAnimationFrame(dragBlock);
})
hammer.on("panend", function (e) {
  if (Math.abs(drag.dx) < drag.maxDrag) {
    drag.dx = 0;
    requestAnimationFrame(dragBlock);
  }
  else {
    descriptions.animateDescription();
    setTimeout(descriptions.swapDescription.bind(descriptions), descriptions.timeout);
    requestAnimationFrame(throwBlock);





  }
})
function prevAnimation() {
  let initDel = 500;
  let frames = drag.maxDrag;
  let spd = 15;
  for (let i = 1; i < frames; i++) {
    setTimeout(() => {
      if (!block.interact) {
        drag.dx = i;
        if (drag.frameBusy) return;
        requestAnimationFrame(dragBlock);
      }
    }, initDel + spd * i);
  }
  for (let i = frames; i >= 0; i--) {
    setTimeout(() => {
      if (!block.interact) {
        drag.dx = i;
        if (drag.frameBusy) return;
        requestAnimationFrame(dragBlock);
      }
    }, initDel + spd * (frames * 2 + 1 - i));
  }
}
prevAnimation()



function toggleClass(el, x) {
  if ( -1 !== el.className.indexOf(x) ) {
    el.className = el.className.replace( " "+x, "" );
  } else {
    el.className += " "+x;
  }
}

function toggleClassAll(list, x) {
  for (var i = 0; i < list.length; i++) {
    if ( -1 !== list[i].className.indexOf(x) ) {
      list[i].className = list[i].className.replace( " "+x, "" );
    } else {
      list[i].className += " "+x;
    }
  }
}

var show = function (elem) {
  elem.style.display = 'block';
};

// Hide an element
var hide = function (elem) {
  elem.style.display = 'none';
};

// Toggle element visibility
var toggle = function (elem) {
  // If the element is visible, hide it
  if (window.getComputedStyle(elem).display === 'block') {
    hide(elem);
    return;
  }
  show(elem);
};

var add_html_0 =
'<div class="comment-wrapper '

var add_html_1 = [
  '">',
  '<div class="comment">',
    '<div class="comment_content">',
      '<span class="name"><a class="" href="#">사나</a></span>',
      '<span class="content">'].join('\n');

var add_html_2 = [
      '</span>',
      '<div class="num-liked">',
        '<i class="icon-like"> 3</i>',
      '</div>',
    '</div>',
    '<div class="comment_options">',
      '<span class="comment-main_options__like">',
        '<a href="#">좋아요</a>',
      '</span>',

      '<span class="comment_options__reply">',
        '<a href="#">· 댓글 달기</a>',
      '</span>',
      '<span class="comment_options__date">',
      '· 1시간 전',
      '</span>',
    '</div>',
  '</div>',
  '<div class="profile-image"></div>',
'</div>'
].join("\n");


hammer.on('tap', function (e) {
  if (!touchZone.parentElement.classList.contains('flip')) {
    touchZone.parentElement.classList.add('flip');
    setTimeout(function() {toggle(touchZone)},700);
    var plusButton = curBlocks.backBlocks[0].querySelector('#plusButton');
    var plusVer = curBlocks.backBlocks[0].querySelector('.plusVer');
    var backContent = curBlocks.backBlocks[0].querySelector('.back-content');
    var options = curBlocks.backBlocks[0].querySelector('.options');
    var nav_btns = curBlocks.backBlocks[0].querySelectorAll('.nav_btn');
    var followers = curBlocks.backBlocks[0].querySelectorAll('.follower');
    for (var i = 0; i < followers.length; i++) {
      followers[i].addEventListener('click', function(e){
        toggleClass(e.path[3],'follower')
        toggleClass(e.path[3], 'main')
      })
    }


    var isAdmin = true;
    var addZoneBtn = curBlocks.backBlocks[0].querySelector('.button1');
    addZoneBtn.addEventListener('click', function(e){
      var added = addZone.value;

      if (isAdmin == true) {
        curBlocks.backBlocks[0].children[0].innerHTML +=add_html_0+ add_html_1 + added + add_html_2;
        curBlocks.backBlocks[0].children[0].scrollTop = curBlocks.backBlocks[0].children[0].scrollHeight;
        addZone.value = "";
      } else {
        curBlocks.backBlocks[0].children[0].innerHTML +=add_html_0+'follower'+ add_html_1 + added + add_html_2;
        curBlocks.backBlocks[0].children[0].scrollTop = curBlocks.backBlocks[0].children[0].scrollHeight;
        addZone.value = "";
      }

    })

    var addZone = curBlocks.backBlocks[0].querySelector('.add');
    addZone.addEventListener('keydown', function(e){
      var keycode = (e.keyCode ? e.keyCode : e.which);
      if (keycode == '13') {
        var added = addZone.value;

        if (isAdmin == true) {
          curBlocks.backBlocks[0].children[0].innerHTML +=add_html_0+'main'+ add_html_1 + added + add_html_2;
          curBlocks.backBlocks[0].children[0].scrollTop = curBlocks.backBlocks[0].children[0].scrollHeight;
          addZone.value = "";
        } else {
          curBlocks.backBlocks[0].children[0].innerHTML +=add_html_0+'follower'+ add_html_1 + added + add_html_2;
          curBlocks.backBlocks[0].children[0].scrollTop = curBlocks.backBlocks[0].children[0].scrollHeight;
          addZone.value = "";
        }
      }

    })
    var switchBtn = curBlocks.backBlocks[0].querySelector('.switchBtn');
    switchBtn.addEventListener('click', function(e){
      isAdmin = !isAdmin;
      toggleClass(switchBtn, 'active')
    })
    plusButton.addEventListener('click', function(e){
      toggleClass(plusVer,'plusVer_active');
      toggleClass(backContent,'picture_up');
      toggle(options);
      toggleClass(options,'options_show');
      toggleClassAll(nav_btns,'nav_btns_hide');
    });
    }
  }
)

var touchZone2 = document.querySelectorAll('.icon-action-undo')
for (var i = 0; i < touchZone2.length; i++) {
  touchZone2[i].addEventListener('click', function(e){
    if (touchZone.parentElement.className.indexOf('flip')) {
      touchZone.parentElement.classList.remove('flip');
      toggle(touchZone);
  }
})
}

var touchZone3 = document.querySelectorAll('.icon-heart')
for (var i = 0; i < touchZone3.length; i++) {
  // console.log(touchZone3);
  touchZone3[i].addEventListener('click', function(e){
    // console.log(e);
    toggleClass(e.target, 'liked')
  }
)
}

var touchZone4 = document.querySelectorAll('.icon-bell');
for (var i = 0; i < touchZone4.length; i++) {
  touchZone4[i].addEventListener('click', function(e){
    toggleClass(e.target, 'following')
  })
}

// var touchZone2 = document.querySelector('.back')
// var hammer2 = new Hammer(touchZone2);
//
// hammer2.on('tap', function (e) {
//   if (e.target.offsetParent.className == "content") {
//     if (touchZone.parentElement.className.indexOf('flip')) {
//       touchZone.parentElement.classList.remove('flip');
//       toggle(touchZone);
//     }
//   }
// })
var filterData = document.querySelector('.filterData');
filterData.addEventListener('click', function(e){
  var allData = curBlocks.backBlocks[0].querySelectorAll('.comment-wrapper')
  var filtered = allData.filter(post =>{post.className.includes('main')
        })
        console.log(filtered);
});
