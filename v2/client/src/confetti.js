// (async () => {
//   await loadConfettiPreset(tsParticles);

//   await tsParticles.load("tsparticles", {
//     particles: {
//       shape: {
//         type: "image",
//         image: {
//           src: "https://i.imgur.com/IKXxIIm.png",
//           width: 200,
//           height: 200
//         },

//       },
//       life: {
//         duration: {
//           value: 0
//         }
//       },
//       number: {
//         value: 200,
//         max: 0,
//         density: {
//           enable: true
//         }
//       },
//       move: {
//         gravity: {
//           enable: false
//         },
//         decay: 0,
//         direction: "bottom",
//         speed: 2,
//         outModes: {
//           default: "out",
//           left: "out",
//           right: "out",
//           bottom: "out",
//           top: "out"
//         }
//       },
//       size: {
//         value: 22
//       },
//       opacity: {
//         value: 0.5,
//         animation: {
//           enable: false
//         }
//       }
//     },
//     background: {
//       color: "#232323",
//       opacity: 0
//     },
//     emitters: [],
//     interactivity: {
//       events: {
//         onClick: {
//           enable: true,
//           mode: "repulse"
//         }
//       }
//     },
//     preset: "confetti"
//   });
// })();


for(i=0; i<100; i++) {
  // Random rotation
  var randomRotation = Math.floor(Math.random() * 360);
    // Random Scale
  var randomScale = Math.random() * 1;
  // Random width & height between 0 and viewport
  var randomWidth = Math.floor(Math.random() * Math.max(document.documentElement.clientWidth, window.innerWidth || 0));
  var randomHeight =  Math.floor(Math.random() * Math.max(document.documentElement.clientHeight, window.innerHeight || 500));
  
  // Random animation-delay
  var randomAnimationDelay = Math.floor(Math.random() * 15);
  // console.log(randomAnimationDelay);

  // Random colors
  var colors = ['#0CD977', '#FF1C1C', '#FF93DE', '#5767ED', '#FFC61C', '#8497B0']
  var randomColor = colors[Math.floor(Math.random() * colors.length)];

  // Create confetti piece
  var confetti = document.createElement('div');
  confetti.className = 'confetti';
  confetti.style.top=randomHeight + 'px';
  confetti.style.right=randomWidth + 'px';
  confetti.style.backgroundColor=randomColor;
  // confetti.style.transform='scale(' + randomScale + ')';
  confetti.style.transform='skew(15deg) rotate(' + randomRotation + 'deg)';
  confetti.style.animationDelay=randomAnimationDelay + 's';
  document.getElementById("confetti-wrapper").appendChild(confetti);
}