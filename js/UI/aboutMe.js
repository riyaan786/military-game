// ======================================================
// aboutMe.js — Standalone About Me for Main Menu
// ======================================================
window.showAboutMe = function() {
  var m = document.getElementById('modal');
  var c = document.getElementById('modalContent');
  if (!m || !c) return;
  c.innerHTML = '<h3>❤️ ABOUT ME</h3>' +
    '<div style="font-size:10px;color:#b0c8d8;line-height:1.6;margin-top:6px">' +
    '<p>Hi, I\'m Riyaan, a solo game developer. This game is the result of countless hours of work, learning, and dedication. I don\'t have a large studio, a publisher, or a team behind me—just a passion for creating games and bringing my ideas to life.</p>' +
    '<p style="margin-top:10px">Game development is currently my only source of income, so every purchase, review, and share directly helps me continue working on this project and creating future updates. When you support this game, you\'re supporting a real person chasing a dream.</p>' +
    '<p style="margin-top:10px">If you\'ve enjoyed playing, please consider leaving a review or telling a friend about it. Even small acts of support make a huge difference for an independent developer like me.</p>' +
    '<p style="margin-top:10px">Thank you for being part of this journey and for helping me keep creating.</p>' +
    '<p style="margin-top:12px;color:#ff8899;font-size:11px">— Riyaan ❤️</p>' +
    '</div>' +
    '<button onclick="document.getElementById(\'modal\').classList.remove(\'show\')" style="width:100%;padding:8px;background:#182230;color:#5a7a8a;border:1px solid rgba(43,111,219,0.1);border-radius:3px;cursor:pointer;margin-top:12px">CLOSE</button>';
  m.classList.add('show');
};