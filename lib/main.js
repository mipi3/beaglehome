// var Output = 1;
// var Input = 2;

// function setPinMode(pin, mode) {
//     'use strict';

//     console.write('pin: ' + pin.toString() + ' ' + mode.toString());
// }

// var config = {
//     relays: {
//         room1_1: ['P8_13'],
//         room1_2: ['P8_14']
//     },
//     buttons: {
//         room1_1b: 'P8_19',
//         room1_2b: 'P8_20'
//     },
//     map: {
//         room1_1b: "room1",
//         room1_2b: "room1"
//     }
// };

// set all relay pins as output

// function setPinModeToGroup(group, mode) {
//     'use strict';

//     var value, i, relayGroup;

//     for (value in group) {
//         if (group.hasOwnProperty(value)) {
//             relayGroup = config.relays[value];
//             for (i = 0; i < relayGroup.length; i++) {
//                 setPinMode(relayGroup[i], mode);
//             }
//         }
//     }
// }

// setPinMode(config.relays, Output);
// setPinMode(config.buttons, Input);

// b.pinMode('P8_19', b.INPUT);
//b.pinMode('P8_13', b.OUTPUT);

//setInterval(check, 100);

// function check() {
//   b.digitalRead('P8_19', checkButton);
// }

// function checkButton(x) {
//   if(x.value == 1){
//     b.digitalWrite('P8_13', b.HIGH);
//   }
//   else{
//     b.digitalWrite('P8_13', b.LOW);
//   }
// }