import { createMachine, createActor } from 'xstate';

const orderStateMachine = createMachine({
    id: 'order',
    initial: 'created',
    states: {
        created: {
            on: {
                PICK_UP: 'pickedUp',
                CANCEL: 'cancelled',
            },
        },
        pickedUp: {
            on: {
                DELIVER: 'delivered',
                RETURN: 'returning',
            },
        },
        delivered: {
            type: 'final',
        },
        returning: {
            on: {
                RETURNED: 'returned',
            },
        },
        returned: {
            type: 'final',
        },
        cancelled: {
            type: 'final',
        },
    },
    on: {
        // Prevent transitioning to cancelled or delivered from any state
        CANCEL: {
            target: '.cancelled',
        },
        DELIVER: {
            target: '.delivered',
            
        },
        // Prevent transitioning to returned from any state other than returning
        RETURNED: {
            target: '.returned',
            
        },
    },
});
const actor = createActor(orderStateMachine);

// const orderStateMachine = createMachine({
//   id: 'order',
//   initial: 'created',
//   states: {
//     created: {
//       on: {
//         PICK_UP: 'pickedUp',
//         CANCEL: 'cancelled',
//       },
//     },
//     pickedUp: {
//       on: {
//         DELIVER: 'delivered',
//         RETURN: 'returning',
//       },
//     },
//     delivered: {
//       type: 'final',
//     },
//     returning: {
//       on: {
//         RETURNED: 'returned',
//       },
//     },
//     returned: {
//       type: 'final',
//     },
//     cancelled: {
//       type: 'final',
//     },
//   },
// });


// const actor = createActor(orderStateMachine);

